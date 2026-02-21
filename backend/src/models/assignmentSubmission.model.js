import mongoose from "mongoose";

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: String,   // text submission

    link: String,      // external link

    file: {
      url: String,
      publicId: String,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    isLate: Boolean,

    marks: Number,

    feedback: String,

    status: {
      type: String,
      enum: ["Not Submitted", "Submitted", "Late Submitted", "Evaluated"],
      default: "Submitted",
    },
  },
  { timestamps: true }
);

const AssignmentSubmission = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);

export default AssignmentSubmission;