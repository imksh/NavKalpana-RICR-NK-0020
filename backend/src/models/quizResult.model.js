import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionIndex: Number, // position in quiz
    selectedAnswerIndex: Number,
    correctAnswerIndex: Number,
    isCorrect: Boolean,
  },
  { _id: false }
);

const quizResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    scorePercent: Number,
    correctCount: Number,
    totalQuestions: Number,

    answers: [answerSchema], // 🔥 NEW FIELD

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* Prevent duplicate attempts */
quizResultSchema.index(
  { studentId: 1, quizId: 1 },
  { unique: true }
);

const QuizResult = mongoose.model("QuizResult", quizResultSchema);
export default QuizResult;