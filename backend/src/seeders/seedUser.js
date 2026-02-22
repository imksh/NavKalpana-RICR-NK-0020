import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

export const seedUsers = async () => {
  try {
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("ksh777", 10);

    /* ================= STUDENT ================= */

    const student = await User.create({
      name: "Karan Sharma",
      email: "karan03945@gmail.com",
      password: hashedPassword,
      role: "student",
      photo: {
        url: "https://placehold.co/600x400?text=K",
        publicId: "",
      },
      preferredLanguage: "en",
      themePreference: "light",
      skillsAcquired: [],
      learningStreak: {
        current: 0,
        longest: 0,
        lastActiveDate: new Date(),
      },
      averageQuizScore: 0,
      averageAssignmentScore: 0,
      aiUsageCount: 0,
    });

    /* ================= INSTRUCTOR ================= */

    const instructor0 = await User.create({
      name: "Raj Vardhan",
      photo: {
        url: "https://placehold.co/600x400?text=R",
        publicId: "",
      },
      email: "instructor@gradify.com",
      password: hashedPassword,
      skillsAcquired: ["JavaScript", "Node.js", "React"],
      role: "instructor",
      preferredLanguage: "en",
      themePreference: "dark",
      aiUsageCount: 5,
    });

    const instructor1 = await User.create({
      name: "Pranay Das",
      photo: {
        url: "https://placehold.co/600x400?text=P",
        publicId: "",
      },
      email: "pranay@gradify.com",
      password: hashedPassword,
      skillsAcquired: ["Java", "DSA"],
      role: "instructor",
      preferredLanguage: "en",
      themePreference: "dark",
      aiUsageCount: 5,
    });

    const instructor2 = await User.create({
      name: "Dr. Aryan Mehta",
      photo: {
        url: "https://placehold.co/600x400?text=A",
        publicId: "",
      },
      email: "aryan@gradify.com",
      password: hashedPassword,
      skillsAcquired: ["Programming", "Python", "Teaching"],
      role: "instructor",
      preferredLanguage: "en",
      themePreference: "dark",
      aiUsageCount: 5,
    });

    /* ================= ADMIN ================= */

    const admin = await User.create({
      name: "Admin User",
      photo: {
        url: "https://placehold.co/600x400?text=A",
        publicId: "",
      },
      email: "admin@gradify.com",
      password: hashedPassword,
      role: "admin",
      preferredLanguage: "en",
      themePreference: "dark",
    });

    console.log("Demo users created successfully");

    console.log("\nLogin Credentials:");
    console.log("Student → karan03945@gmail.com / ksh777");
    console.log("Instructor 1 → raj@gradify.com / ksh777");
    console.log("Instructor 2 → pranay@gradify.com / ksh777");
    console.log("Instructor 3 → aryan@gradify.com / ksh777");
    console.log("Admin → admin@gradify.com / ksh777");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
