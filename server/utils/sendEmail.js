import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {v4 as uuidv4} from "uuid";
import Verification from "../models/EmailVerification.js";
import { hashString } from "./hashString.js";
dotenv.config();

const { auth_email, auth_password,app_url } = process.env;
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:auth_email,
        pass:auth_password,
    },
});
export const sendVerificationEmail = async(user,res)=>{
    const { _id, email, lastName, firstName } = user;
    const token = _id + uuidv4();
    const link = app_url + "users/verify/" + _id + "/" + token;
    const mailOptions = {
        from:  auth_email,
        to: email,
        subject: "Email Verification",
        html: 
            `<div
                style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'
            >
                <h3 style="color: rgb(8, 56, 188)">Please verify your email address</h3>
                <hr>
                <h4>Hi ${lastName+" "+firstName},</h4>
                <p>
                    Please verify your email address so we can know that it's really you.
                    <br>
                    <p>This link <b>expires in 1 hour</b></p>
                    <br>
                    <a href=${link}
                        style="color: #fff; padding: 14px; text-decoration: none; background-color: #000;  border-radius: 8px; font-size: 18px;">Verify
                        Email Address
                    </a>
                </p>
                <div style="margin-top: 20px;">
                    <h5>Best Regards</h5>
                    <h5>ShareFun Team</h5>
                </div>
            </div>`,
    }
    try {
        const hashedToken = await hashString(token);
    
        const newVerifiedEmail = await Verification.create({
            userId: _id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
    
        if (newVerifiedEmail) {
            transporter
            .sendMail(mailOptions)
            .then(() => {
                res.status(201).send({
                    success: "PENDING",
                    message:
                    "Verification email has been sent to your account. Check your email for further instructions.",
                });
            })
            .catch((err) => {
                res.status(404).json({ message: "Something went wrong" });
            });
        }
    } catch (error) {
        res.status(404).json({ message: "Something went wrong" });
    }
    
};