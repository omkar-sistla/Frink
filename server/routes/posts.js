import express from "express";
import { 
    commentPostController, createPostController, 
    deletePostController, getCommentsController, 
    getFeedController, getPostController, getUserPostsController, 
    likePostController 
} from "../controllers/postController.js";

import { verifyToken } from "../middleware/verifyToken.js";
export const postRoutes = express.Router();
postRoutes.get("/feed",verifyToken, getFeedController);
postRoutes.get("/:userId/posts",getUserPostsController);
postRoutes.get("/:postId", verifyToken, getPostController);
postRoutes.get("/:id/comments",verifyToken,getCommentsController);

postRoutes.patch("/:id/like",verifyToken,likePostController);
postRoutes.patch("/:id/comment",verifyToken,commentPostController);

postRoutes.post("/newpost",verifyToken,createPostController);
postRoutes.delete("/:id/delete",verifyToken,deletePostController);
