import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
const env = dotenv.config();
const secret = process.env.SECRET;

export const sendToken = (userDetails, res) => {
    const token = jwt.sign({
        user:userDetails,
        expires:new Date(Date.now() + 3 * 60 * 60 * 1000 )
    }, secret);
    
    res.status(200).json({user:userDetails,token:token});
};
