import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true
  },

  title: {
    en: { type: String, required: true },
    hi: { type: String }
  },

  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },

  videoUrl: String,

  notes: {
    en: String,
    hi: String
  },

  tags: [String],

  keyConcepts: [String],

  estimatedDurationMinutes: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

export default mongoose.model("Lesson", lessonSchema);