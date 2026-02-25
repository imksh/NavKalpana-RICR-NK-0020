import express from "express";
import protectedRoute from "../middlewares/auth.middleware.js";
import { studentProtect } from "../middlewares/roleProtect.middleware.js";
import {
  getEvents,
  getLearningActivity,
  getStudentProgress,
  getUpcomingEvents,
  growthDashboard,
  leaderboard,
  lessonOpened,
  stats,
} from "../controllers/student.controller.js";
import { getStudentCourse } from "../controllers/course.controller.js";
import {
  getAssignmentById,
  getStudentAssignments,
  submitAssignment,
} from "../controllers/assignment.controller.js";
import {
  downloadAttendanceReport,
  getStudentAttendance,
} from "../controllers/attendance.controller.js";
import cloudinaryUpload from "../middlewares/cloudinaryUpload.middleware.js";
import {
  getQuizById,
  getQuizResult,
  getStudentQuizzes,
  submitQuiz,
} from "../controllers/quiz.controller.js";
import {
  bookSession,
  getStudentSessions,
} from "../controllers/session.controller.js";
import {
  createDoubt,
  getStudentDoubts,
} from "../controllers/doubt.controller.js";

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

router.get(
  "/growth-dashboard",
  protectedRoute,
  studentProtect,
  growthDashboard,
);

router.get("/quizzes", protectedRoute, getStudentQuizzes);

router.post("/quizzes/submit", protectedRoute, submitQuiz);
router.get("/quizzes/:id", protectedRoute, getQuizById);

router.get("/quizzes/:id/result", protectedRoute, getQuizResult);

router.post(
  "/assignments/:id/submit",
  protectedRoute,
  cloudinaryUpload.single("file"),
  submitAssignment,
);

router.get("/leaderboard", protectedRoute, leaderboard);

router.get("/events/upcoming", protectedRoute, getUpcomingEvents);

router.get("/events", protectedRoute, getEvents);

router.post("/lesson/:id/opened", protectedRoute, lessonOpened);

router.get("/attendance/report", protectedRoute, downloadAttendanceReport);

router.post("/book-session", protectedRoute, bookSession);

router.post("/doubts", protectedRoute, createDoubt);

router.get("/doubts", protectedRoute, getStudentDoubts);

router.get("/sessions", protectedRoute, getStudentSessions);

export default router;
