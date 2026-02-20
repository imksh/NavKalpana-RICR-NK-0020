import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    title: {
      en: { type: String, required: true },
      hi: { type: String },
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    videoUrl: String,

    notes: {
      en: String,
      hi: String,
    },

    objectives: [
      {
        en: String,
        hi: String,
      },
    ],

    keyConcepts: [String],

    content: {
      en: String,
      hi: String,
    },

    codeExample: String,

    estimatedDurationMinutes: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;
