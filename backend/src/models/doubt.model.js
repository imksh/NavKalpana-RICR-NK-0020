import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Answered", "Closed"],
      default: "Pending",
    },

    reply: {
      type: String,
    },

    repliedAt: Date,
  },
  { timestamps: true }
);

const Doubt = mongoose.model("Doubt", doubtSchema);
export default Doubt;