import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

const seedUsers = async () => {
  try {
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("123456", 10);

    /* ================= STUDENT ================= */

    const student = await User.create({
      name: "Karan Student",
      email: "student@gradify.com",
      password: hashedPassword,
      role: "student",
      preferredLanguage: "en",
      themePreference: "light",
      skillsAcquired: [
        "React",
        "Node.js",
        "MongoDB"
      ],
      learningStreak: {
        current: 5,
        longest: 12,
        lastActiveDate: new Date()
      },
      averageQuizScore: 82,
      averageAssignmentScore: 88,
      aiUsageCount: 14
    });

    /* ================= INSTRUCTOR ================= */

    const instructor = await User.create({
      name: "Rohit Instructor",
      email: "instructor@gradify.com",
      password: hashedPassword,
      role: "instructor",
      preferredLanguage: "en",
      themePreference: "dark",
      aiUsageCount: 5
    });

    /* ================= ADMIN ================= */

    const admin = await User.create({
      name: "Admin User",
      email: "admin@gradify.com",
      password: hashedPassword,
      role: "admin",
      preferredLanguage: "en",
      themePreference: "dark"
    });

    console.log("Demo users created successfully");

    console.log("\nLogin Credentials:");
    console.log("Student → student@gradify.com / 123456");
    console.log("Instructor → instructor@gradify.com / 123456");
    console.log("Admin → admin@gradify.com / 123456");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();