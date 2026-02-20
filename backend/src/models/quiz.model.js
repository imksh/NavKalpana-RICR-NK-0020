import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: String,

    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],

    explanation: String,
  },
  { _id: false },
);

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },

    title: String,

    durationMinutes: {
      type: Number,
      required: true,
    },

    totalQuestions: Number,

    questions: [questionSchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
