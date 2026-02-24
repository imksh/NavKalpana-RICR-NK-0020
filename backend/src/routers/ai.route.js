import express from "express";
import protectedRoute from "../middlewares/auth.middleware.js";
import { studentProtect } from "../middlewares/roleProtect.middleware.js";
import {
  getAiModels,
  chatWithAi,
  getConversation,
  getUserConversations,
  deleteConversation,
  getQuizReview,
} from "../controllers/ai.controller.js";

const router = express.Router();

// Get all available AI models
router.get("/models", protectedRoute, studentProtect, getAiModels);

// Chat with AI
router.post("/chat", protectedRoute, studentProtect, chatWithAi);

// Get conversation history
router.get("/conversation/:conversationId", protectedRoute, getConversation);

// Get all user conversations
router.get(
  "/conversations",
  protectedRoute,
  studentProtect,
  getUserConversations,
);

// Delete a conversation
router.delete(
  "/conversation/:conversationId",
  protectedRoute,
  studentProtect,
  deleteConversation,
);

// Quiz AI Review
router.post("/quiz-review", protectedRoute, studentProtect, getQuizReview);

export default router;
