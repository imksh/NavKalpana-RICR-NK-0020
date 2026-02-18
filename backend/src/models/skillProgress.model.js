import mongoose from "mongoose";

const skillProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  skillName: {
    type: String
  },

  acquiredFromCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  acquiredAt: {
    type: Date
  }

});

export default mongoose.model("SkillProgress", skillProgressSchema);