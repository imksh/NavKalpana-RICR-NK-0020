import mongoose from "mongoose";
import dotenv from "dotenv";
import Module from "../models/module.model.js";
import Lesson from "../models/lesson.model.js";

dotenv.config();

const generateSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const seedLessons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    /* ===== Clear old lessons ===== */
    await Lesson.deleteMany();
    console.log("Old lessons deleted");

    const modules = await Module.find().sort({ order: 1 });

    if (!modules.length) {
      console.log("No modules found. Seed modules first.");
      process.exit();
    }

    for (const module of modules) {
      const lessonsData = [
        {
          title: {
            en: "Introduction to Concepts",
            hi: "कॉन्सेप्ट का परिचय",
          },
          difficulty: "Beginner",
          duration: 20,
        },
        {
          title: {
            en: "Deep Dive into Implementation",
            hi: "इम्प्लीमेंटेशन की गहराई",
          },
          difficulty: "Intermediate",
          duration: 35,
        },
        {
          title: {
            en: "Advanced Optimization Techniques",
            hi: "एडवांस ऑप्टिमाइजेशन तकनीकें",
          },
          difficulty: "Advanced",
          duration: 45,
        },
      ];

      let order = 1;

      for (const lesson of lessonsData) {
        await Lesson.create({
          moduleId: module._id,
          slug: generateSlug(`${lesson.title.en}-${module._id}-${order}`),
          title: lesson.title,
          difficulty: lesson.difficulty,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          objectives: [
            {
              en: "Understand the core topic",
              hi: "मुख्य विषय को समझें",
            },
          ],
          content: {
            en: "This lesson explains the topic in detail with examples.",
            hi: "यह पाठ उदाहरणों के साथ विषय को समझाता है।",
          },
          keyConcepts: ["Logic", "Structure", "Best Practices"],
          codeExample: `
function Example() {
  return <h1>Hello World</h1>;
}
          `,
          estimatedDurationMinutes: lesson.duration,
          order,
        });

        order++;
      }

      console.log(`Lessons created for module: ${module.title.en}`);
    }

    console.log("Lesson seeding completed ✅");
    process.exit();
  } catch (error) {
    console.error("Seeder Error:", error);
    process.exit(1);
  }
};

seedLessons();
