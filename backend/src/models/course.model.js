import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  // ===== Basic Info =====
  title: {
    en: { type: String, required: true },
    hi: { type: String }
  },

  description: {
    en: { type: String, required: true },
    hi: { type: String }
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  thumbnail: {
    type: String
  },

  // ===== Academic Structure =====
  totalModules: {
    type: Number,
    default: 0
  },

  totalLessons: {
    type: Number,
    default: 0
  },

  skills: [
    {
      type: String
    }
  ],

  tags: [
    {
      type: String
    }
  ],

  estimatedDurationMinutes: {
    type: Number
  },

  difficultyLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"]
  },

  // ===== Status =====
  isPublished: {
    type: Boolean,
    default: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

export default mongoose.model("Course", courseSchema);