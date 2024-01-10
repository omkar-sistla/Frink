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