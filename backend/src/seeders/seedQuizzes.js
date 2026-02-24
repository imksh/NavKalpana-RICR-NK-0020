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

    const courses = await Course.find();

    if (!courses.length) {
      console.log("Seed courses first.");
      process.exit();
    }

    const quizzes = [];

    for (const course of courses) {
      const module = await Module.findOne({ courseId: course._id });

      /* ================= REACT QUIZ ================= */
      if (course.title?.en?.toLowerCase().includes("full stack")) {
        quizzes.push({
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
                { text: "A backend language", isCorrect: false },
              ],
              explanation:
                "JSX allows writing HTML-like syntax inside JavaScript.",
            },
            {
              questionText: "Which hook manages state?",
              options: [
                { text: "useState", isCorrect: true },
                { text: "useEffect", isCorrect: false },
                { text: "useMemo", isCorrect: false },
                { text: "useRef", isCorrect: false },
              ],
              explanation: "useState manages local component state.",
            },
          ],
          isActive: true,
        });
      }

      /* ================= DSA QUIZ ================= */
      if (course.title?.en?.toLowerCase().includes("data")) {
        quizzes.push({
          courseId: course._id,
          moduleId: module?._id || null,
          title: "Data Structures Basics Quiz",
          durationMinutes: 20,
          totalQuestions: 5,
          questions: [
            {
              questionText: "What is the time complexity of binary search?",
              options: [
                { text: "O(log n)", isCorrect: true },
                { text: "O(n)", isCorrect: false },
                { text: "O(n²)", isCorrect: false },
                { text: "O(1)", isCorrect: false },
              ],
              explanation:
                "Binary search divides the array in half each time.",
            },
            {
              questionText: "Which data structure uses FIFO?",
              options: [
                { text: "Queue", isCorrect: true },
                { text: "Stack", isCorrect: false },
                { text: "Tree", isCorrect: false },
                { text: "Graph", isCorrect: false },
              ],
              explanation:
                "Queue follows First In First Out order.",
            },
          ],
          isActive: true,
        });
      }

      /* ================= PROGRAMMING BASICS QUIZ ================= */
      if (course.title?.en?.toLowerCase().includes("program")) {
        quizzes.push({
          courseId: course._id,
          moduleId: module?._id || null,
          title: "Programming Fundamentals Quiz",
          durationMinutes: 15,
          totalQuestions: 5,
          questions: [
            {
              questionText: "What is a variable?",
              options: [
                { text: "A container for storing data", isCorrect: true },
                { text: "A loop type", isCorrect: false },
                { text: "A database", isCorrect: false },
                { text: "An API", isCorrect: false },
              ],
              explanation:
                "Variables store values that can change during execution.",
            },
            {
              questionText: "Which keyword declares a constant in JS?",
              options: [
                { text: "const", isCorrect: true },
                { text: "var", isCorrect: false },
                { text: "let", isCorrect: false },
                { text: "static", isCorrect: false },
              ],
              explanation:
                "const declares a constant variable in JavaScript.",
            },
          ],
          isActive: true,
        });
      }
    }

    await Quiz.insertMany(quizzes);

    console.log(`✓ ${quizzes.length} quizzes seeded successfully`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedQuizzes();