import express from 'express';
import { verifyEmailController } from '../controllers/verificationController.js';
export const verifyRouter = express.Router();

verifyRouter.get("/verify/:userId/:token",verifyEmailController)