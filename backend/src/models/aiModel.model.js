import mongoose from "mongoose";

const aiModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: [
        "CourseHelper",
        "PlacementHelper",
        "DoubtSolver",
        "CareerGuide",
        "ProjectMentor",
        "DSAMentor",
        "FSDMentor",
        "ProgrammingBasicsMentor"
      ],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    systemPrompt: {
      type: String,
      required: true,
    },
    icon: String,
    color: String,
    avatar: String,
    role: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const AiModel = mongoose.model("AiModel", aiModelSchema);
export default AiModel;
