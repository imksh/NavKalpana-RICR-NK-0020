import mongoose from "mongoose";
import dotenv from "dotenv";
import Module from "../models/module.model.js";
import Course from "../models/course.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

const seedModules = async () => {
  try {
    await Module.deleteMany();

    const courses = await Course.find();

    if (!courses.length) {
      console.log("No courses found. Seed courses first.");
      process.exit();
    }

    for (const course of courses) {
      const modules = [
        {
          courseId: course._id,
          title: {
            en: "Introduction & Fundamentals",
            hi: "परिचय और मूल बातें"
          },
          order: 1,
          estimatedDurationMinutes: 120,
          tags: ["Basics", "Overview"]
        },
        {
          courseId: course._id,
          title: {
            en: "Core Concepts",
            hi: "मुख्य कॉन्सेप्ट"
          },
          order: 2,
          estimatedDurationMinutes: 180,
          tags: ["Core", "Structure"]
        },
        {
          courseId: course._id,
          title: {
            en: "Practical Implementation",
            hi: "प्रैक्टिकल इम्प्लीमेंटेशन"
          },
          order: 3,
          estimatedDurationMinutes: 240,
          tags: ["Practice", "Hands-on"]
        },
        {
          courseId: course._id,
          title: {
            en: "Advanced Topics",
            hi: "एडवांस विषय"
          },
          order: 4,
          estimatedDurationMinutes: 200,
          tags: ["Advanced", "Optimization"]
        }
      ];

      await Module.insertMany(modules);
    }

    console.log("Modules seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedModules();