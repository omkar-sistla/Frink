import express from "express";
import { registerController, loginController, logoutController, getUpdatedUser, autoLogoutController } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const registerRoute = express.Router()
export const loginRoute = express.Router()
export const logoutRoute = express.Router()
export const updateUserRoute = express.Router()
export const autoLogoutRoute = express.Router()
registerRoute.post("/", registerController);
loginRoute.post("/",loginController);
logoutRoute.post("/",logoutController);
autoLogoutRoute.get("/",verifyToken,autoLogoutController);
updateUserRoute.post("/", verifyToken, getUpdatedUser)