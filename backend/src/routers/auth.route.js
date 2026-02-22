import express from "express";

import {
  signup,
  login,
  logout,
  checkAuth,
  genOtp,
  verifyOtp,
  resetPassword,
  updateProfile,
  changePassword,
  changePhoto,
} from "../controllers/auth.controller.js";
import protectedRoute from "../middlewares/auth.middleware.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";
import resetPasswordMiddleware from "../middlewares/resetPassword.middleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer();

router.post("/register", signup);
router.post("/login", loginLimiter, login);
router.post("/logout", protectedRoute, logout);
router.get("/check", protectedRoute, checkAuth);

router.post("/gen-otp", genOtp);
router.post("/verify-otp", verifyOtp);
router.put("/reset-password", resetPasswordMiddleware, resetPassword);

router.patch("/update-profile", protectedRoute, updateProfile);

router.put(
  "/change-photo",
  protectedRoute,
  upload.single("image"),
  changePhoto,
);

router.put("/change-password", protectedRoute, changePassword);

export default router;
