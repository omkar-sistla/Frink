import express from "express";
import dotenv from 'dotenv';
import helmet from "helmet";
import morgan from "morgan";
import connectDb from "./DB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./routes/users.js";
import { registerRoute, loginRoute, logoutRoute, updateUserRoute } from "./routes/auth.js";
import { profileRoute } from "./routes/userProfile.js";
import { postRoutes } from "./routes/posts.js";
import { verifyRouter } from "./routes/verification.js";

const env = dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());
connectDb();
app.listen(PORT,()=>{
    console.log(`Welcome ${PORT}`);
})

app.use("/users",router);
app.use("/register",registerRoute);
app.use("/login",loginRoute);
app.use("/logout",logoutRoute);
app.use("/updateuser",updateUserRoute);
app.use("/profile",profileRoute);
app.use("/",postRoutes);
app.use("/users",verifyRouter);

