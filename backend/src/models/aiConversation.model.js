import mongoose from "mongoose";

const aiConversationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    modelName: {
      type: String,
      enum: [
        "CourseHelper",
        "PlacementHelper",
        "DoubtSolver",
        "CareerGuide",
        "ProjectMentor",
        "DSAMentor",
        "FSDMentor",
        "ProgrammingBasicsMentor",
      ],
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const AiConversation = mongoose.model("AiConversation", aiConversationSchema);
export default AiConversation;
