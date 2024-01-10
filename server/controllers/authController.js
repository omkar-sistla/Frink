import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
export const registerController = async(req,res)=>{
    try{
        const {
            email,
            username,
            password,
            firstName,
            lastName,
            profilePhoto,
            date_of_birth
        } = req.body;
        const [emailExists, usernameExists] = await Promise.all([
            User.findOne({ email }),
            User.findOne({ username }),
        ]);
          
        if (emailExists) {
            res.status(409).json("Email Address already exists");
            return
        } else if(usernameExists){          
            res.status(409).json("Username already exists");
        } else{
            const salt = await bcrypt.genSalt();
            const HashedPassword = await bcrypt.hash(password,salt);
            const newUser = new User({
                email,
                username,
                password: HashedPassword,
                firstName,
                lastName,
                date_of_birth,
                profilePhoto
            });
            const savedUser = await newUser.save();
            sendVerificationEmail(savedUser, res);
        }

    } catch(err){
        res.status(500).json(err.message)
    }
};

export const loginController = async(req,res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if (!user){
            res.status(404).json("User not found");
        } else{
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (validPassword === false){
                res.status(404).json("Invalid Password");
            } else if(user.isVerified===false){
                res.status(404).json("Email not verified, please check your mail");
            } else{
                const userDetails = {
                    "username":user.username,
                    "displayName":user.firstName+" "+user.lastName,
                    "email":user.email,
                    "followers":user.followers.length,
                    "followings":user.followings.length,
                    "bio":user.bio,
                    "city":user.city,
                    "profilePhoto":user.profilePhoto,
                    "id":user._id
                };
                console.log(userDetails);
                sendToken(userDetails, res);
            }
        }
    } catch(err){
        res.status(500).json(err.message)
    }
};

export const logoutController = async(req,res)=>{
    try{
        res.cookie("token",null,{
            expires: new Date(Date.now()),
            httpOnly: true
        });
        res.status(200).json({
            message:"Logged Out Successfully"
        })
    } catch(err){
        res.status(500).json(err.message)
    }
};

export const getUpdatedUser = async(req, res) => {
    try{
        const {id} = req.body;
        if (id===req.user.id){
            const user = await User.findById(id);
            const userDetails = {
                "username":user.username,
                "displayName":user.firstName+" "+user.lastName,
                "email":user.email,
                "followers":user.followers.length,
                "followings":user.followings.length,
                "bio":user.bio,
                "city":user.city,
                "profilePhoto":user.profilePhoto,
                "id":user._id
            };
            sendToken(userDetails, res);
        } else{
            res.status(500).json("Forbidden User");
        }  
    } catch(err){
        res.status(500).json(err.message);
    }
};