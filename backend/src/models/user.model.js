import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // ===== Basic Info =====
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  // ===== Role =====
  role: {
    type: String,
    enum: ["student", "admin", "instructor"],
    default: "student"
  },

  // ===== Preferences =====
  preferredLanguage: {
    type: String,
    enum: ["en", "hi"],
    default: "en"
  },

  themePreference: {
    type: String,
    enum: ["light", "dark"],
    default: "light"
  },

  // ===== Skills =====
  skillsAcquired: [String],

  // ===== Learning Streak =====
  learningStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActiveDate: { type: Date }
  },

  // ===== Performance Metrics =====
  averageQuizScore: {
    type: Number,
    default: 0
  },

  averageAssignmentScore: {
    type: Number,
    default: 0
  },

  // ===== AI Tracking =====
  aiUsageCount: {
    type: Number,
    default: 0
  },

  // ===== Status =====
  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);