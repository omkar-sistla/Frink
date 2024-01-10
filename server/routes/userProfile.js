import express from "express";
import { privatePublicController } from "../controllers/userProfileController.js";
export const profileRoute = express.Router();
profileRoute.put("/public-private/:id",privatePublicController);