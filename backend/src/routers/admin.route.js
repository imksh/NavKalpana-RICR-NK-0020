import express from "express";
import { createAlumni } from "../controllers/alumni.controller.js";
import { sendTestNotificationToStudents } from "../controllers/admin.controller.js";
import protectedRoute from "../middlewares/auth.middleware.js";
import { adminProtect } from "../middlewares/roleProtect.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, adminProtect, createAlumni);
router.post(
  "/send-test-notification",
  protectedRoute,
  adminProtect,
  sendTestNotificationToStudents,
);

export default router;
