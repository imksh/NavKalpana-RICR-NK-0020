import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      en: { type: String, required: true },
      hi: { type: String },
    },

    order: {
      type: Number,
      required: true,
    },

    estimatedDurationMinutes: {
      type: Number,
      default: 0,
    },

    tags: [String],
  },
  { timestamps: true },
);

const Module = mongoose.model("Module", moduleSchema);
export default Module;
