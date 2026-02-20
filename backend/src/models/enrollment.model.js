import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    progressPercent: {
      type: Number,
      default: 0,
    },

    attendancePercent: {
      type: Number,
      default: 0,
    },

    lastAccessed: {
      type: Date,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
