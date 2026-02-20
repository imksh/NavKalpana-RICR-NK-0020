import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    type: {
      type: String,
      enum: ["Internship", "Full-Time"],
    },
    skills: [String],
    stipend: String,
    salary: String,
    deadline: Date,
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;