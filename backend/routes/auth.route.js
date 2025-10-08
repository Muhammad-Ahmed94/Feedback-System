import express from 'express';
import { getProfile, login, logout, resendVerificationEmail, signup, verifyEmail } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/resend-verification", resendVerificationEmail);
router.get("/verify-email", verifyEmail);

// Protected routes
router.post("/logout", protectRoute, logout);
router.get("/profile", protectRoute, getProfile);


export default router;