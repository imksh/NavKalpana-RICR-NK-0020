import mongoose from "mongoose";

const skillProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  skillName: {
    type: String,
  },

  acquiredFromCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },

  acquiredAt: {
    type: Date,
  },
});

const SkillProgress = mongoose.model("SkillProgress", skillProgressSchema);
export default SkillProgress;
