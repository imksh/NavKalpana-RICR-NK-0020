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

    const student = await User.findOne({ role: "student" });
    const course = await Course.findOne();

    if (!student || !course) {
      console.log("Student or Course not found. Seed them first.");
      process.exit();
    }

    const attendanceRecords = [];

    const totalDays = 40; // last 40 class days

    for (let i = 0; i < totalDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Skip Sundays (optional realistic touch)
      if (date.getDay() === 0) continue;

      attendanceRecords.push({
        studentId: student._id,
        courseId: course._id,
        date,
        status: Math.random() > 0.15 ? "Present" : "Absent"
      });
    }

    await Attendance.insertMany(attendanceRecords);

    console.log("Attendance seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAttendance();