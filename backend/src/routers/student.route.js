import express from "express";
import protectedRoute from "../middlewares/auth.middleware.js";
import { studentProtect } from "../middlewares/roleProtect.middleware.js";
import {
  getLearningActivity,
  getStudentProgress,
  stats,
} from "../controllers/student.controller.js";
import { getStudentCourse } from "../controllers/course.controller.js";
import {
  getAssignmentById,
  getStudentAssignments,
} from "../controllers/assignment.controller.js";
import { getStudentAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.get("/stats", protectedRoute, studentProtect, stats);
router.get(
  "/learning-activity",
  protectedRoute,
  studentProtect,
  getLearningActivity,
);

router.get("/courses", protectedRoute, studentProtect, getStudentCourse);

router.get("/assignments", protectedRoute, getStudentAssignments);

router.get("/assignments/:id", protectedRoute, getAssignmentById);

router.get("/attendance", protectedRoute, getStudentAttendance);

router.get("/progress", protectedRoute, getStudentProgress);

export default router;
