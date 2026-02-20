import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedUsers } from "./seedUser.js";
// import { seedAdmin } from "./seedAdmin.js";
import { seedCourses } from "./seedCourses.js";
import { seedModules } from "./seedModules.js";
import { seedLessons } from "./seedLessons.js";
import { seedAssignments } from "./seedAssignments.js";
import { seedQuizzes } from "./seedQuizzes.js";
import { seedEnrollment } from "./seedEnrollment.js";
import { seedAttendance } from "./seedAttendance.js";
import { seedLearningActivity } from "./seedActivity.js";
import { seedSkillProgress } from "./seedSkillProgress.js";

dotenv.config();

const runSeeders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");

    console.log("🚀 Starting Full Database Seeding...\n");

    await seedUsers();
    // await seedAdmin();
    await seedCourses();
    await seedModules();
    await seedLessons();
    await seedAssignments();
    await seedQuizzes();
    await seedEnrollment();
    await seedAttendance();
    await seedLearningActivity();
    await seedSkillProgress();

    console.log("\n🎉 All Seeders Executed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeder Failed ❌", error);
    process.exit(1);
  }
};

runSeeders();
