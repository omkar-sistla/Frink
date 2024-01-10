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
            };
            res.status(200).json(userDetails);
        } else{
            res.status(400).json("User not exists");
        }
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getFollowersController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.query.id;
        if (userId !== req.user.id){
            res.status(500).json("Forbidden User");
        } else{
            const user = await User.findById(id);
            const followers = await Promise.all(
                user.followers.map((id) => User.findById(id))
            );
            const formattedFollowers = followers.map(
                ({ _id, firstName, lastName, profilePhoto }) => {
                return { _id, firstName, lastName, profilePhoto };
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
            const { id } = req.params;
            const user = await User.findById(id);
        
            const followings = await Promise.all(
                user.followings.map((id) => User.findById(id))
            );
            const formattedFollowings = followings.map(
                ({ _id, firstName, lastName, profilePhoto }) => {
                return { _id, firstName, lastName, profilePhoto };
                }
            );
            res.status(200).json(formattedFollowings);
        }
    } catch (err) {
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