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
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    hiredStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
