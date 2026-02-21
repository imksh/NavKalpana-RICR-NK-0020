import mongoose from "mongoose";
import dotenv from "dotenv";
import Alumni from "../models/alumni.model.js";

dotenv.config();

const alumniData = [
  {
    name: "Rahul Sharma",
    role: "Frontend Developer",
    company: "Infosys",
    batchYear: "2024",
    skills: ["React", "Node.js", "MongoDB"],
    linkedin: "https://linkedin.com",
    packageLPA: 6.2,
    isPlaced: true,
    image: {
      url: "https://i.pravatar.cc/150?img=11",
    },
  },
  {
    name: "Anjali Verma",
    role: "Data Analyst",
    company: "TCS",
    batchYear: "2023",
    skills: ["Python", "SQL", "Power BI"],
    linkedin: "https://linkedin.com",
    packageLPA: 5.8,
    isPlaced: true,
    image: {
      url: "https://i.pravatar.cc/150?img=5",
    },
  },
  {
    name: "Karan Patel",
    role: "Backend Engineer",
    company: "Accenture",
    batchYear: "2022",
    skills: ["Node.js", "Express", "AWS"],
    linkedin: "https://linkedin.com",
    packageLPA: 7.5,
    isPlaced: true,
    image: {
      url: "https://i.pravatar.cc/150?img=8",
    },
  },
  {
    name: "Priya Singh",
    role: "Full Stack Developer",
    company: "Wipro",
    batchYear: "2024",
    skills: ["React", "Express", "MySQL"],
    linkedin: "https://linkedin.com",
    packageLPA: 6.0,
    isPlaced: true,
    image: {
      url: "https://i.pravatar.cc/150?img=9",
    },
  },
  {
    name: "Arjun Mehta",
    role: "Cloud Engineer",
    company: "Cognizant",
    batchYear: "2023",
    skills: ["AWS", "Docker", "Kubernetes"],
    linkedin: "https://linkedin.com",
    packageLPA: 8.2,
    isPlaced: true,
    image: {
      url: "https://i.pravatar.cc/150?img=12",
    },
  },
];

const seedAlumni = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    // 🔥 Optional: clear existing
    await Alumni.deleteMany();

    await Alumni.insertMany(alumniData);

    console.log("Alumni Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding Failed:", error);
    process.exit(1);
  }
};

seedAlumni();