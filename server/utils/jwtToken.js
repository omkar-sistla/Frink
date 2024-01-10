import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
const env = dotenv.config();
const secret = process.env.SECRET;

export const sendToken = (userDetails, res) => {
    const token = jwt.sign({user:userDetails}, secret); // Fix here
    const options = {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(200).cookie("token", token, options).json({user:userDetails,token:token});
};
