import mongoose from "mongoose";
import dotenv from "dotenv";
import Attendance from "../models/attendance.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

export const seedAttendance = async () => {
  try {
    await Attendance.deleteMany();

    const students = await User.find({ role: "student" });
    const courses = await Course.find();

    if (!students.length || !courses.length) {
      console.log("Seed users and courses first.");
      process.exit();
    }

    const attendanceRecords = [];

    for (const student of students) {
      for (const course of courses) {
        const totalDays = 40;

        for (let i = 0; i < totalDays; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);

          if (date.getDay() === 0) continue; // Skip Sundays

          attendanceRecords.push({
            studentId: student._id,
            courseId: course._id,
            date,
            status: Math.random() > 0.15 ? "Present" : "Absent",
          });
        }
      }
    }

    await Attendance.insertMany(attendanceRecords);

    console.log("Attendance seeded successfully for all students");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAttendance();