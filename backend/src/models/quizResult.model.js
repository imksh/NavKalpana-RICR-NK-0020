import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },

  scorePercent: Number,

  correctCount: Number,

  totalQuestions: Number,

  submittedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

export default mongoose.model("QuizResult", quizResultSchema);