import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
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

    topic: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String, // store as "14:30"
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
