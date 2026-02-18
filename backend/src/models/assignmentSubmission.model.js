import mongoose from "mongoose";

const assignmentSubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  submissionType: {
    type: String,
    enum: ["file", "text", "link"],
    required: true
  },

  content: String, // file URL / text / link

  submittedAt: {
    type: Date,
    default: Date.now
  },

  isLate: Boolean,

  marks: Number,

  feedback: String,

  status: {
    type: String,
    enum: ["Not Submitted", "Submitted", "Late Submitted", "Evaluated"],
    default: "Submitted"
  }

}, { timestamps: true });

export default mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);