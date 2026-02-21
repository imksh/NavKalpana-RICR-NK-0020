import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Event from "../models/event.model.js";

dotenv.config();

const seedUpcomingEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Event.deleteMany();
    console.log("Old events removed");

    const course = await Course.findOne();
    const admin = await User.findOne({ role: "admin" });

    const now = new Date();

    const events = [
      {
        title: "React Assignment Deadline",
        description: "Submit your React fundamentals assignment.",
        eventType: "assignment",
        courseId: course?._id,
        startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        priority: 1,
        createdBy: admin?._id,
      },
      {
        title: "JavaScript Quiz",
        description: "Module 2 quiz will open.",
        eventType: "quiz",
        courseId: course?._id,
        startDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        priority: 2,
        createdBy: admin?._id,
      },
      {
        title: "Live Doubt Session",
        description: "Zoom session for backend doubts.",
        eventType: "live_session",
        courseId: course?._id,
        startDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        location: "https://zoom.us/j/123456789",
        priority: 1,
        createdBy: admin?._id,
      },
      {
        title: "Mid-Term Exam",
        description: "Prepare well for the upcoming mid-term.",
        eventType: "exam",
        courseId: course?._id,
        startDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        priority: 1,
        createdBy: admin?._id,
      },
    ];

    await Event.insertMany(events);

    console.log("Events Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUpcomingEvents();