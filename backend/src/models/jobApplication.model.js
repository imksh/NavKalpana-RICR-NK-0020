import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    coverLetter: String,
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Rejected", "Selected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);

export default JobApplication;