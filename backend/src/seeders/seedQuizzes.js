import mongoose from "mongoose";
import dotenv from "dotenv";
import Quiz from "../models/quiz.model.js";
import Course from "../models/course.model.js";
import Module from "../models/module.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

const seedQuizzes = async () => {
  try {
    await Quiz.deleteMany();

    const course = await Course.findOne();
    const module = await Module.findOne({ courseId: course?._id });

    if (!course) {
      console.log("Seed courses first.");
      process.exit();
    }

    const quiz = await Quiz.create({
      courseId: course._id,
      moduleId: module?._id || null,
      title: "React Fundamentals Quiz",
      durationMinutes: 15,
      totalQuestions: 5,
      questions: [
        {
          questionText: "What is JSX?",
          options: [
            { text: "A JavaScript syntax extension", isCorrect: true },
            { text: "A database", isCorrect: false },
            { text: "A CSS framework", isCorrect: false },
            { text: "A backend language", isCorrect: false }
          ],
          explanation: "JSX allows writing HTML-like syntax inside JavaScript."
        },
        {
          questionText: "Which hook is used for state management?",
          options: [
            { text: "useState", isCorrect: true },
            { text: "useEffect", isCorrect: false },
            { text: "useRef", isCorrect: false },
            { text: "useMemo", isCorrect: false }
          ],
          explanation: "useState is used to manage local state in React."
        },
        {
          questionText: "Which method is used to create an Express server?",
          options: [
            { text: "express()", isCorrect: true },
            { text: "createServer()", isCorrect: false },
            { text: "initServer()", isCorrect: false },
            { text: "nodeServer()", isCorrect: false }
          ],
          explanation: "Calling express() initializes the Express application."
        },
        {
          questionText: "What does MongoDB store data in?",
          options: [
            { text: "Documents", isCorrect: true },
            { text: "Tables", isCorrect: false },
            { text: "Rows", isCorrect: false },
            { text: "Sheets", isCorrect: false }
          ],
          explanation: "MongoDB stores data in BSON documents."
        },
        {
          questionText: "Which HTTP method is used to update data?",
          options: [
            { text: "PUT", isCorrect: true },
            { text: "GET", isCorrect: false },
            { text: "DELETE", isCorrect: false },
            { text: "FETCH", isCorrect: false }
          ],
          explanation: "PUT is typically used for updating existing data."
        }
      ],
      isActive: true
    });

    console.log("Quiz seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedQuizzes();