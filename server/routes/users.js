import express from "express";
import { getUserController, getFollowersController, getFollowingsController,
followController, acceptRequestController, searchUserController } from "../controllers/users.js";
import { verifyToken } from "../middleware/verifyToken.js";
export const router = express.Router();
router.get("/:username", getUserController);
router.get("/:id/followers",verifyToken, getFollowersController);
router.get("/:id/followings", verifyToken, getFollowingsController);
router.get("/searchuser/:q",searchUserController);
router.get("/:id/recommendations",getRecUserController);
router.patch("/follow/:id/:otherUserId", verifyToken, followController);
router.patch("/acceptrequest/:id/:otherUserId", verifyToken, acceptRequestController);
