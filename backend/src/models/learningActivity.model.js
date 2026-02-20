import mongoose from "mongoose";

const learningActivitySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },

  actionType: {
    type: String,
    enum: [
      "lesson_opened",
      "lesson_completed",
      "quiz_attempted",
      "assignment_submitted",
    ],
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LearningActivity = mongoose.model(
  "LearningActivity",
  learningActivitySchema,
);

export default LearningActivity;
