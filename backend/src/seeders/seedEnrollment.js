import mongoose from "mongoose";
import dotenv from "dotenv";
import Enrollment from "../models/enrollment.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Lesson from "../models/lesson.model.js";
import Attendance from "../models/attendance.model.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

export const seedEnrollment = async () => {
  try {
    await Enrollment.deleteMany();

    const students = await User.find({ role: "student" });
    const courses = await Course.find();

    if (!students.length || !courses.length) {
      console.log("Seed users and courses first.");
      process.exit();
    }

    for (const student of students) {
      for (const course of courses) {
        /* ===== LESSON PROGRESS ===== */
        const lessons = await Lesson.find({ courseId: course._id });

        const completedLessons = lessons
          .slice(0, Math.floor(lessons.length / 2))
          .map((l) => l._id);

        const progress =
          lessons.length > 0
            ? Math.round(
                (completedLessons.length / lessons.length) * 100
              )
            : 0;

        /* ===== ATTENDANCE CALCULATION ===== */
        const attendanceRecords = await Attendance.find({
          studentId: student._id,
          courseId: course._id,
        });

        const totalClasses = attendanceRecords.length;

        const presentCount = attendanceRecords.filter(
          (a) => a.status === "Present"
        ).length;

        const attendancePercent =
          totalClasses > 0
            ? Math.round((presentCount / totalClasses) * 100)
            : 0;

        /* ===== CREATE ENROLLMENT ===== */
        await Enrollment.create({
          studentId: student._id,
          courseId: course._id,
          completedLessons,
          progressPercent: progress,
          attendancePercent,
          lastAccessed: new Date(),
        });
      }
    }

    console.log("Enrollment seeded successfully for all students");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedEnrollment();