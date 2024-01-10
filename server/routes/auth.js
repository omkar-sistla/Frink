import express from "express";
import { registerController, loginController, logoutController, getUpdatedUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const registerRoute = express.Router()
export const loginRoute = express.Router()
export const logoutRoute = express.Router()
export const updateUserRoute = express.Router()
registerRoute.post("/", registerController);
loginRoute.post("/",loginController);
logoutRoute.post("/",logoutController);
updateUserRoute.post("/", verifyToken, getUpdatedUser)