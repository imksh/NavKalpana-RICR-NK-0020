import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

const seedCourses = async () => {
  try {
    await Course.deleteMany();

    // Get instructor
    const instructor = await User.findOne({ role: "instructor" });

    if (!instructor) {
      console.log("No instructor found. Seed users first.");
      process.exit();
    }

    const courses = await Course.insertMany([
      {
        title: {
          en: "Full Stack Web Development",
          hi: "फुल स्टैक वेब डेवलपमेंट"
        },
        description: {
          en: "Master MERN stack with real-world projects.",
          hi: "रियल वर्ल्ड प्रोजेक्ट्स के साथ MERN स्टैक सीखें।"
        },
        instructor: instructor._id,
        thumbnail: "https://placehold.co/600x400?text=FullStack",
        totalModules: 4,
        totalLessons: 18,
        skills: ["React", "Node.js", "MongoDB", "Express"],
        tags: ["Web Development", "MERN", "JavaScript"],
        estimatedDurationMinutes: 1200,
        difficultyLevel: "Intermediate",
        isPublished: true,
        isActive: true
      },
      {
        title: {
          en: "Data Structures & Algorithms",
          hi: "डेटा स्ट्रक्चर और एल्गोरिदम"
        },
        description: {
          en: "Strengthen problem-solving skills for interviews.",
          hi: "इंटरव्यू के लिए प्रॉब्लम सॉल्विंग स्किल मजबूत करें।"
        },
        instructor: instructor._id,
        thumbnail: "https://placehold.co/600x400?text=DSA",
        totalModules: 6,
        totalLessons: 30,
        skills: ["Arrays", "Recursion", "Trees", "Graphs"],
        tags: ["DSA", "Interview Prep"],
        estimatedDurationMinutes: 1500,
        difficultyLevel: "Advanced",
        isPublished: true,
        isActive: true
      },
      {
        title: {
          en: "Introduction to Programming",
          hi: "प्रोग्रामिंग का परिचय"
        },
        description: {
          en: "Perfect beginner course to start coding.",
          hi: "कोडिंग शुरू करने के लिए बेहतरीन शुरुआती कोर्स।"
        },
        instructor: instructor._id,
        thumbnail: "https://placehold.co/600x400?text=Programming",
        totalModules: 3,
        totalLessons: 12,
        skills: ["Logic Building", "Basics of C", "Flowcharts"],
        tags: ["Beginner", "Programming"],
        estimatedDurationMinutes: 600,
        difficultyLevel: "Beginner",
        isPublished: true,
        isActive: true
      }
    ]);

    console.log("Courses seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedCourses();