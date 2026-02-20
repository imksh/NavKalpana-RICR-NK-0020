import mongoose from "mongoose";
import dotenv from "dotenv";
import Assignment from "../models/assignment.model.js";
import Course from "../models/course.model.js";
import Module from "../models/module.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

const seedAssignments = async () => {
  try {
    await Assignment.deleteMany();

    // Get a course
    const course = await Course.findOne();

    if (!course) {
      console.log("No course found. Seed courses first.");
      process.exit();
    }

    // Optional: get a module
    const module = await Module.findOne({ course: course._id });

    const assignments = await Assignment.insertMany([
      {
        courseId: course._id,
        moduleId: module?._id || null,
        title: "Build a React Landing Page",
        description:
          "Create a responsive landing page using React and Tailwind CSS.",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        maxMarks: 100
      },
      {
        courseId: course._id,
        moduleId: module?._id || null,
        title: "Create REST API with Express",
        description:
          "Develop CRUD APIs using Node.js and Express.",
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        maxMarks: 100
      },
      {
        courseId: course._id,
        moduleId: module?._id || null,
        title: "MongoDB Schema Design",
        description:
          "Design optimized Mongoose schemas for LMS platform.",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        maxMarks: 100
      }
    ]);

    console.log("Assignments seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAssignments();