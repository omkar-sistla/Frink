import { User } from "../models/User.js";
export const getUserController = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({username:username}).select('-password');
        const isFollowing = req.query.id ? user.followers.includes(req.query.id) : false;
        const isRequested = req.query.id ? user.requests.includes(req.query.id) : false;
        const isFollower = req.query.id ? user.followings.includes(req.query.id) : false;
        if (user){
            const userDetails = {
                "id":user._id,
                "username":user.username,
                "displayName":user.firstName+" "+user.lastName,
                "followers":user.followers.length,
                "followings":user.followings.length,
                "posts":user.posts.length,
                "bio":user.bio,
                "city":user.city,
                "profilePhoto":user.profilePhoto,
                "isPrivate":user.isPrivate,
                "isFollowing":isFollowing,
                "isRequested":isRequested,
                "isFollower":isFollower,
                "profileposts":(isFollowing || !user.isPrivate) ? user.posts.reverse() : null,
            };
            res.status(200).json(userDetails);
        } else{
            res.status(400).json("User not exists");
        }
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const searchUserController = async(req,res)=>{
    try{
        const searchTerm = req.params.q;
        console.log(searchTerm);
        const users = await User.find({
            $or:[
                { username: { $regex: `^${searchTerm}`, $options: 'i' } },
                { firstName: { $regex: `^${searchTerm}`, $options: 'i' } },
                { lastName: { $regex: `^${searchTerm}`, $options: 'i' } },
            ],
        }).select("username firstName lastName profilePhoto");
        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getFollowersController = async (req, res) => {
    try {
        const { username } = req.params;
        const userId = req.query.id;
        if (userId !== req.user.id){
            res.status(500).json("Forbidden User");
        } else{
            const user = await User.findOne({username:username});
            const followers = await Promise.all(
                user.followers.map((id) => User.findById(id))
            );
            console.log(followers);
            const formattedFollowers = followers.map(
                ({ _id, firstName, lastName, profilePhoto, username }) => {
                return { _id, firstName, lastName, profilePhoto, username };
                }
            );
            res.status(200).json(formattedFollowers);
        }

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getFollowingsController = async (req, res) => {
    try {       
        const userId = req.query.id;
        if (userId !== req.user.id){
            res.status(500).json("Forbidden User");
        } else{
            const { username } = req.params;
            const user = await User.findOne({username:username});
            const followings = await Promise.all(
                user.followings.map((id) => User.findById(id))
            );
            console.log(followings);
            const formattedFollowings = followings.map(
                ({ _id, firstName, lastName, profilePhoto, username }) => {
                return { _id, firstName, lastName, profilePhoto, username };
                }
            );
            res.status(200).json(formattedFollowings);
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};

export const followController = async (req, res) => {
    try {
        const { id, otherUserId } = req.params;
        if (id !== req.user.id){
            res.status(500).json("Forbidden User")
        } else{
            const user = await User.findById(id);
            const otherUser = await User.findById(otherUserId);

            if (user.followings.includes(otherUserId)) {
                user.followings = user.followings.filter((id) => id !== otherUserId);
                otherUser.followers = otherUser.followers.filter((id) => id != id);
            } else {
                if (otherUser.isPrivate){
                    if (user.sent_requests.includes(otherUserId)){
                        user.sent_requests = user.sent_requests.filter((id) => id !== otherUserId);
                        otherUser.requests = otherUser.requests.filter((id) => id !== id);
                    } else{
                        user.sent_requests.push(otherUserId)
                        otherUser.requests.push(id)
                    }
                } else{
                    user.followings.push(otherUserId)
                    otherUser.followers.push(id)
                }
            }
            await user.save();
            await otherUser.save();

            // const followings = await Promise.all(
            //     user.followings.map((id) => User.findById(id))
            // );
            // const formattedFollowings = followings.map(
            //     ({ _id, firstName, lastName, profilePhoto }) => {
            //     return { _id, firstName, lastName, profilePhoto };
            //     }
            // );
            res.status(200).json({message: "Success"});
        }
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const acceptRequestController = async (req,res) => {
    try{
        const { id, otherUserId } = req.params;
        if (id !== req.user.id){
            res.status(500).json("Forbidden User")
        } else{
            const user = await User.findById(id);
            const otherUser = await User.findById(otherUserId);
            user.followers.push(otherUserId);
            otherUser.followings.push(id);
            user.requests = user.requests.filter((id) => id != otherUserId);
            otherUser.sent_requests = otherUser.sent_requests.filter((id) => id != id);
            await user.save();
            await otherUser.save();
            res.status(200).json({message: "Success"});
        }
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getRecUserController = async(req,res)=>{
    try{
        const id=req.params.id
        if (!id){
            res.status(500).json("Forbidden User")
        } else{
            const user = await User.findById(id);
            const followingIds = user.followings
            const followedByFollowings = await User.find({ _id : {$in:followingIds}}).select('followings');
            const followedByFollowingsIds = followedByFollowings.flatMap(user => user.followings);
            const recommendedUsers = await User.find({
                _id: { $in: followedByFollowingsIds, $nin:[...followingIds,id] }
            }).limit(20).select('username profilePhoto')
            if(recommendedUsers.length>20){
                res.status(200).json(recommendedUsers);
            } else{
                console.log(followedByFollowingsIds);
                // console.log(followingIds);
                const moreRecommendations = await User.find({
                    _id: { $nin: [...followingIds,id]}
                }).limit(20).select('username profilePhoto')
                res.status(200).json(moreRecommendations);
            }
        }
    } catch(err){
        // console.log(err)
        res.status(404).json({message: "Internal Server Error"})
    }
}
