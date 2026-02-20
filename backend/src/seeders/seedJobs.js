import dotenv from "dotenv";
import mongoose from "mongoose";
import Job from "../models/job.model.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedJobs = async () => {
  try {
    await connectDB();

    console.log("Old jobs deleted...");
    await Job.deleteMany();

    const jobs = [
      {
        title: "Frontend Developer Intern",
        company: "Infosys",
        location: "Remote",
        type: "Internship",
        skills: ["React", "JavaScript", "Tailwind"],
        stipend: "₹15,000/month",
        deadline: new Date("2026-03-15"),
        description:
          "Work on modern frontend applications using React and Tailwind CSS.",
      },
      {
        title: "Backend Engineer",
        company: "TCS",
        location: "Bangalore",
        type: "Full-Time",
        skills: ["Node.js", "MongoDB", "Express"],
        salary: "₹6 LPA",
        deadline: new Date("2026-03-10"),
        description:
          "Build scalable REST APIs and optimize backend performance.",
      },
      {
        title: "Machine Learning Intern",
        company: "Wipro",
        location: "Hyderabad",
        type: "Internship",
        skills: ["Python", "TensorFlow", "Pandas"],
        stipend: "₹20,000/month",
        deadline: new Date("2026-03-25"),
        description:
          "Assist in building predictive models and data analysis pipelines.",
      },
      {
        title: "Full Stack Developer",
        company: "HCL",
        location: "Pune",
        type: "Full-Time",
        skills: ["MERN", "REST APIs", "Docker"],
        salary: "₹8 LPA",
        deadline: new Date("2026-03-18"),
        description:
          "Develop full-stack applications using MERN architecture.",
      },
      {
        title: "Data Analyst Intern",
        company: "Accenture",
        location: "Remote",
        type: "Internship",
        skills: ["SQL", "Power BI", "Excel"],
        stipend: "₹18,000/month",
        deadline: new Date("2026-04-01"),
        description:
          "Analyze business data and generate actionable insights.",
      },
    ];

    await Job.insertMany(jobs);

    console.log("Jobs seeded successfully ✅");
    process.exit();
  } catch (error) {
    console.error("Seeder Error:", error);
    process.exit(1);
  }
};

seedJobs();