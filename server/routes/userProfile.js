import express from "express";
import { privatePublicController, updateProfileController, updateProfilePhoto } from "../controllers/userProfileController.js";
import { verifyToken } from "../middleware/verifyToken.js";
export const profileRoute = express.Router();
profileRoute.put("/public-private/:id",privatePublicController);
profileRoute.patch("/update-profile",verifyToken,updateProfileController);
profileRoute.patch("/update-profile-photo",verifyToken,updateProfilePhoto);