import mongoose from "mongoose";
import { PostSchema } from "./Post.js";
const UserSchema = new mongoose.Schema(
    {
        username : {
            type: String,
            required: true,
            min: 5,
            max: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        firstName:{
            type: String,
            required: true,
            min: 2,
        },
        lastName:{
            type: String,
            default:"",
        },
        profilePhoto:{
            type: String,
            default: "",
        },        
        bio:{
            type: String,
            default: "",
            max: 150,
        },
        city:{
            type: String,
            default: "",
            max: 30,
        },
        date_of_birth:{
            type: Date,
            required: true
        },
        followers:{
            type: Array,
            default:[],
        },
        followings:{
            type: Array,
            default:[],
        },
        sent_requests:{
            type: Array,
            default:[],
        },
        requests:{
            type: Array,
            default:[],
        },
        isVerified:{
            type: Boolean,
            default: false,
        },
        isPrivate:{
            type: Boolean,
            default: false,
        },
        posts:[PostSchema],
    },
    {timestamps: true}
);
export const User = mongoose.model("User", UserSchema);