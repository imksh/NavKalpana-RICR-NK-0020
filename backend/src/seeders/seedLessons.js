import mongoose from "mongoose";
import dotenv from "dotenv";
import Lesson from "../models/lesson.model.js";
import Module from "../models/module.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

const seedLessons = async () => {
  try {
    await Lesson.deleteMany();

    const modules = await Module.find();

    if (!modules.length) {
      console.log("No modules found. Seed modules first.");
      process.exit();
    }

    const lessonsData = [];

    for (const module of modules) {
      lessonsData.push(
        {
          moduleId: module._id,
          title: {
            en: "Introduction to Concepts",
            hi: "कॉन्सेप्ट का परिचय"
          },
          difficulty: "Beginner",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          notes: {
            en: "This lesson introduces the core fundamentals.",
            hi: "यह पाठ मूल सिद्धांतों का परिचय देता है।"
          },
          tags: ["Basics", "Fundamentals"],
          keyConcepts: ["Overview", "Structure"],
          estimatedDurationMinutes: 20
        },
        {
          moduleId: module._id,
          title: {
            en: "Deep Dive into Implementation",
            hi: "इम्प्लीमेंटेशन की गहराई"
          },
          difficulty: "Intermediate",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          notes: {
            en: "Detailed implementation and practical examples.",
            hi: "विस्तृत इम्प्लीमेंटेशन और प्रैक्टिकल उदाहरण।"
          },
          tags: ["Implementation", "Practice"],
          keyConcepts: ["Logic", "Workflow"],
          estimatedDurationMinutes: 35
        },
        {
          moduleId: module._id,
          title: {
            en: "Advanced Optimization Techniques",
            hi: "एडवांस ऑप्टिमाइजेशन तकनीकें"
          },
          difficulty: "Advanced",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          notes: {
            en: "Optimization strategies and advanced patterns.",
            hi: "ऑप्टिमाइजेशन स्ट्रेटेजी और एडवांस पैटर्न।"
          },
          tags: ["Optimization", "Advanced"],
          keyConcepts: ["Performance", "Scalability"],
          estimatedDurationMinutes: 45
        }
      );
    }

    await Lesson.insertMany(lessonsData);

    console.log("Lessons seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedLessons();