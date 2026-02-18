import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module"
  },

  title: String,

  description: String,

  deadline: Date,

  maxMarks: {
    type: Number,
    default: 100
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);