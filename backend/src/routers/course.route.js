import express from "express";
import protectedRoute from "../middlewares/auth.middleware.js";
import {
  getCourse,
  getCourseModules,
  getLessonBySlug,
  getModuleLessons,
  markLessonCompleted,
} from "../controllers/course.controller.js";

const router = express.Router();

router.get("/:slug", protectedRoute, getCourse);
router.get("/:id/modules", protectedRoute, getCourseModules);
router.get("/lesson/:slug", protectedRoute, getLessonBySlug);
router.get("/module/:id/lessons", protectedRoute, getModuleLessons);
router.put("/lesson/:lessonId/completed", protectedRoute, markLessonCompleted);

export default router;
