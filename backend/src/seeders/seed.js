import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Module from "../models/module.model.js";
import Lesson from "../models/lesson.model.js";
import Assignment from "../models/assignment.model.js";
import Quiz from "../models/quiz.model.js";
import Enrollment from "../models/enrollment.model.js";
import LearningActivity from "../models/learningActivity.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

const seed = async () => {
  try {
    await Promise.all([
      User.deleteMany(),
      Course.deleteMany(),
      Module.deleteMany(),
      Lesson.deleteMany(),
      Assignment.deleteMany(),
      Quiz.deleteMany(),
      Enrollment.deleteMany(),
      LearningActivity.deleteMany(),
    ]);

    const hashedPassword = await bcrypt.hash("123456", 10);

    /* ================= USERS ================= */

    const student = await User.create({
      name: "Karan Student",
      email: "student@gradify.com",
      password: hashedPassword,
      role: "student",
    });

    const instructor = await User.create({
      name: "Rohit Instructor",
      email: "instructor@gradify.com",
      password: hashedPassword,
      role: "instructor",
    });

    const admin = await User.create({
      name: "Admin User",
      email: "admin@gradify.com",
      password: hashedPassword,
      role: "admin",
    });

    /* ================= COURSE ================= */

    const course = await Course.create({
      title: {
        en: "Full Stack Web Development",
        hi: "फुल स्टैक वेब डेवलपमेंट",
      },
      description: {
        en: "Learn MERN stack from scratch.",
        hi: "MERN स्टैक को शुरुआत से सीखें।",
      },
      instructor: instructor._id,
      totalLessons: 6,
    });

    /* ================= MODULES ================= */

    const module1 = await Module.create({
      title: "React Basics",
      course: course._id,
    });

    const module2 = await Module.create({
      title: "Node & Express",
      course: course._id,
    });

    /* ================= LESSONS ================= */

    const lessons = await Lesson.insertMany([
      { title: "Intro to React", module: module1._id },
      { title: "Components & Props", module: module1._id },
      { title: "State & Hooks", module: module1._id },
      { title: "Intro to Node", module: module2._id },
      { title: "Express Basics", module: module2._id },
      { title: "REST APIs", module: module2._id },
    ]);

    /* ================= ASSIGNMENTS ================= */

    await Assignment.create({
      title: "Build React App",
      description: "Create a basic React project.",
      course: course._id,
      deadline: new Date(),
    });

    /* ================= QUIZ ================= */

    await Quiz.create({
      title: "React Quiz",
      course: course._id,
      duration: 15,
      questions: [
        {
          question: "What is JSX?",
          options: ["JS Syntax", "JSON", "Java", "None"],
          correctAnswers: [0],
        },
      ],
    });

    /* ================= ENROLLMENT ================= */

    await Enrollment.create({
      student: student._id,
      course: course._id,
    });

    /* ================= LEARNING ACTIVITY ================= */

    const today = new Date();
    const activities = [];

    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      activities.push({
        user: student._id,
        date,
        count: Math.floor(Math.random() * 4),
      });
    }

    await LearningActivity.insertMany(activities);

    console.log("Seed data inserted successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
