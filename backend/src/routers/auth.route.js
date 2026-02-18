import express from "express";

import {
  signup,
  login,
  logout,
  checkAuth,
  genOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controller.js";
import protectedRoute from "../middlewares/auth.middleware.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";
import resetPasswordMiddleware from "../middlewares/resetPassword.middleware.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", loginLimiter, login);
router.post("/logout", protectedRoute, logout);
router.get("/check", protectedRoute, checkAuth);

router.post("/gen-otp", genOtp);
router.post("/verify-otp", verifyOtp);
router.put("/reset-password", resetPasswordMiddleware, resetPassword);

export default router;
