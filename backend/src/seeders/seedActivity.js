import mongoose from "mongoose";
import dotenv from "dotenv";
import LearningActivity from "../models/learningActivity.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

const seedLearningActivity = async () => {
  try {
    await LearningActivity.deleteMany();

    const student = await User.findOne({ role: "student" });
    const course = await Course.findOne();

    if (!student || !course) {
      console.log("Seed users and courses first.");
      process.exit();
    }

    const activities = [];
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const dayOfWeek = date.getDay();

      // Less activity on Sunday
      const baseProbability = dayOfWeek === 0 ? 0.2 : 0.6;

      if (Math.random() < baseProbability) {
        const actionsPerDay = Math.floor(Math.random() * 3) + 1;

        for (let j = 0; j < actionsPerDay; j++) {
          const actionTypes = [
            "lesson_opened",
            "lesson_completed",
            "quiz_attempted",
            "assignment_submitted"
          ];

          activities.push({
            studentId: student._id,
            courseId: course._id,
            actionType:
              actionTypes[Math.floor(Math.random() * actionTypes.length)],
            createdAt: new Date(
              date.setHours(Math.floor(Math.random() * 23))
            )
          });
        }
      }
    }

    await LearningActivity.insertMany(activities);

    console.log("Learning activity seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedLearningActivity();