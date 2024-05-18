import { Post, Comment } from "../models/Post.js";
import { User } from "../models/User.js";
export const createPostController = async(req,res) => {
    const userId = req.user.id;
    try{
        const {desc, img, location} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            location,
            desc,
            userprofilePicture: user.profilePhoto,
            img,
            likes: {}
        })
        await newPost.save();
        user.posts.push(newPost);
        await user.save();
        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getPostController = async(req,res)=>{
    const {postId} = req.params;
    const userId = req.user.id;
    try{
        const post = await Post.findById(postId);
        if (post){
            const postUser = post.userId;
            const user = await User.findById(postUser);
            const isFollower = user.followers.includes(userId);
            if(userId && user.isPrivate && !isFollower){
                res.status(200).send("Private Post")
            } else if(!userId && user.isPrivate){
                res.status(200).send("Please Login")
            } else{
                const userDetails = {
                    "_id": user._id,
                    "username": user.username,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "profilePhoto": user.profilePhoto
                };
                post._doc.userId = userDetails;
                res.status(200).json(post);
            }
        }
        else{
            res.status(404).json({message: 'Post not found'})
        }
    } catch(err){
        res.status(500).json({ message: err.message });
    }
};

export const deletePostController = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId);
        const commentIds = post.comments; 
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (post.userId !== req.user.id) {
            return res.status(403).json({ message: 'You do not have permission to delete this post.' });
        }
        const user = await User.findById(post.userId);
        user.posts = user.posts.filter(post => post._id.toString() !== postId);
        await user.save();
        await Comment.deleteMany({ _id: { $in: commentIds } });
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getFeedController = async(req,res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        const followings = user.followings;
        followings.push(userId);
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 200);
        const feed = await User.find({
            _id: { $in: followings },
            'posts.createdAt': { $gte: tenDaysAgo },
        })
        .select('posts')
        .populate({
            path: 'posts',
            populate: { path: 'userId', select: 'username profilePhoto firstName lastName' },
        })
        const formattedFeed = feed.map(userPosts => userPosts.posts).flat();
        formattedFeed.sort((a,b)=>b.createdAt-a.createdAt);
        res.status(200).json(formattedFeed);
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

export const getUserPostsController = async(req,res) => {
    try{
        const {userId} = req.params;
        const user = await User.findById(userId);
        res.status(200).json(user.posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const likePostController = async(req,res) => {
    try{
        const { id } = req.params;
        const  userId = req.user.id;
        const post = await Post.findById(id);        
        const user = await User.findById(post.userId);
        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }
        const postIndex = user.posts.findIndex((post)=>post._id.toString()===id);
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            {new: true}
        );
        if (postIndex!==-1){
            user.posts[postIndex]=updatedPost
            await user.save()
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const commentPostController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { comment } = req.body;

        // Fetch post
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Fetch user
        const user = await User.findById(post.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add comment
        const newComment = new Comment({
            userId,
            comment
        });
        await newComment.save();

        // Update post comments
        post.comments.push(newComment._id);
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { comments: post.comments },
            { new: true }
        );

        // Update user posts
        const postIndex = user.posts.findIndex((userPost) => userPost._id.toString() === id);
        if (postIndex !== -1) {
            user.posts[postIndex] = updatedPost;
            await user.save();
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        console.error('Error in commentPostController:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCommentsController = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        const commentIds = post.comments;

        const comments = await Comment.find({
            _id: { $in: commentIds }
        });

        const commentsWithUserDetails = await Promise.all(
            comments.map(async (comment) => {
                const user = await User.findById(comment.userId);

                return {
                    _id: comment._id,
                    comment: comment.comment,
                    userId: comment.userId,
                    username: user.username,
                    profilePhoto: user.profilePhoto,
                    createdAt :comment.createdAt,
                };
            })
        );

        res.status(200).json(commentsWithUserDetails);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};