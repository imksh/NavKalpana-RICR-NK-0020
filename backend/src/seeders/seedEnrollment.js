import mongoose from "mongoose";
import dotenv from "dotenv";
import Enrollment from "../models/enrollment.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Lesson from "../models/lesson.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

export const seedEnrollment = async () => {
  try {
    await Enrollment.deleteMany();

    const student = await User.findOne({ role: "student" });
    const courses = await Course.find().limit(2);

    if (!student || courses.length === 0) {
      console.log("Seed users and courses first.");
      process.exit();
    }

    for (const course of courses) {

      // Get lessons for this course
      const lessons = await Lesson.find({ courseId: course._id });

      const completedLessons = lessons.slice(0, Math.floor(lessons.length / 2)).map(l => l._id);

      const progress =
        lessons.length > 0
          ? Math.round((completedLessons.length / lessons.length) * 100)
          : 0;

      await Enrollment.create({
        studentId: student._id,
        courseId: course._id,
        completedLessons,
        progressPercent: progress,
        attendancePercent: Math.floor(Math.random() * 15) + 80, // 80–95%
        lastAccessed: new Date()
      });
    }

    console.log("Enrollment seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedEnrollment();