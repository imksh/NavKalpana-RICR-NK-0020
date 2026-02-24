import mongoose from "mongoose";
import dotenv from "dotenv";
import SkillProgress from "../models/skillProgress.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

const seedSkillProgress = async () => {
  try {
    await SkillProgress.deleteMany();

    const students = await User.find({ role: "student" });
    const courses = await Course.find();

    if (!students.length || !courses.length) {
      console.log("Seed users and courses first.");
      process.exit();
    }

    const skillsToInsert = [];

    for (const student of students) {
      for (const course of courses) {
        if (!course.skills || !course.skills.length) continue;

        const acquiredCount = Math.floor(course.skills.length / 2);

        for (let i = 0; i < acquiredCount; i++) {
          skillsToInsert.push({
            studentId: student._id,
            skillName: course.skills[i],
            acquiredFromCourse: course._id,
            acquiredAt: new Date(
              Date.now() -
                Math.floor(Math.random() * 60) *
                  24 *
                  60 *
                  60 *
                  1000
            ),
          });
        }
      }
    }

    await SkillProgress.insertMany(skillsToInsert);

    console.log("Skill progress seeded successfully for all students");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedSkillProgress();