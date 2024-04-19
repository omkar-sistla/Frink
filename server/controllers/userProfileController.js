import { User } from "../models/User.js";

export const privatePublicController = async(req,res) => {
    try {    
        const {id} = req.params;
        const user = await User.findById(id);
        const isprivate = user.isPrivate;
        if (isprivate){
            user.isPrivate = false;
        } else{
            user.isPrivate = true
        }
        await user.save();

        isprivate ? res.status(200).json("Switched To Public") : res.status(200).json("Switched To Private")
    } catch(err){
        res.status(404).json({ message: err.message })
    }
}
export const updateProfileController = async(req,res)=>{
    try{
        const {id} = req.user
        const {
            username,
            date_of_birth,
            bio,
            city
        } = req.body
        const user = await User.findById(id);
        user.username = username;
        user.bio = bio,
        user.city = city,
        user.date_of_birth = date_of_birth
        await user.save();
        res.status(200).json("Profile Updated");
    } catch(err){
        res.status(404).json({message: err.message})
    }
}
export const updateProfilePhoto = async(req,res)=>{
    try{
        const {id} = req.user
        const {
            imagelink
        } = req.body
        const user = await User.findById(id);
        user.profilePhoto = imagelink;
        await user.save();
        res.status(200).json("Profile Photo Updated");
    } catch(err){
        res.status(404).json({message: err.message})
    }
}