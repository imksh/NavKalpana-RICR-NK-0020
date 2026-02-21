import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    eventType: {
      type: String,
      enum: [
        "assignment",
        "quiz",
        "live_session",
        "announcement",
        "exam",
      ],
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    location: {
      type: String, // Zoom link / classroom / etc
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    priority: {
      type: Number, // 1 = high, 2 = medium, 3 = low
      default: 2,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model(
  "Event",
  EventSchema
);

export default Event;