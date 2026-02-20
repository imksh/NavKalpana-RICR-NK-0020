import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ModulePage = () => {
  const navigate = useNavigate();

  const module = {
    title: "React Basics",
    lessons: [
      {
        id: 1,
        title: "Intro to React",
        difficulty: "Beginner",
        duration: 20,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        notes: "React is a JavaScript library for building UI.",
        objectives: [
          "Understand what React is",
          "Learn about components",
          "Understand virtual DOM",
        ],
        keyConcepts: ["JSX", "Component", "Virtual DOM"],
        content: `
React is a JavaScript library developed by Facebook.

It is used to build user interfaces using reusable components.

Instead of manipulating the DOM manually, React uses a virtual DOM to efficiently update UI.
      `,
        codeExample: `
function App() {
  return (
    <h1>Hello World</h1>
  );
}
      `,
      },
      {
        id: 2,
        title: "Components & Props",
        difficulty: "Beginner",
        duration: 25,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        notes: "Components are reusable building blocks.",
        objectives: [
          "Create functional components",
          "Pass props between components",
        ],
        keyConcepts: ["Props", "Reusable Components"],
        content: `
Components are independent and reusable pieces of UI.

Props allow passing data from parent to child components.
      `,
        codeExample: `
function Welcome(props) {
  return <h1>Hello {props.name}</h1>;
}
      `,
      },
    ],
  };

  const [currentLesson, setCurrentLesson] = useState(module.lessons[0]);
  const [completed, setCompleted] = useState([]);

  const progressPercent = Math.round(
    (completed.length / module.lessons.length) * 100,
  );

  const toggleComplete = (id) => {
    if (completed.includes(id)) {
      setCompleted(completed.filter((l) => l !== id));
    } else {
      setCompleted([...completed, id]);
    }
  };

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      {/* HEADER */}
      <div className="mb-10">
        <button
          onClick={() => navigate(-1)}
          className="text-(--color-primary) mb-4"
        >
          ← Back to Course
        </button>

        <h1 className="text-3xl font-semibold">{module.title}</h1>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Module Progress</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="w-full h-3 bg-(--bg-muted) rounded-full">
            <div
              className="h-3 bg-(--color-primary) rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-3 gap-10">
        {/* LEFT MAIN CONTENT */}
        <div className="md:col-span-2 space-y-6">
          {/* VIDEO */}
          <div className="rounded-2xl overflow-hidden shadow-md">
            <iframe
              src={currentLesson.videoUrl}
              title="Lesson Video"
              className="w-full h-80"
              allowFullScreen
            />
          </div>

          {/* DETAILS */}
          <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl space-y-6">
            {/* TITLE */}
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {currentLesson.title}
              </h2>

              <p className="text-sm text-(--text-secondary)">
                {currentLesson.difficulty} • {currentLesson.duration} min
              </p>
            </div>

            {/* OBJECTIVES */}
            <div>
              <h3 className="font-semibold mb-2">Learning Objectives</h3>
              <ul className="list-disc list-inside text-(--text-secondary) space-y-1">
                {currentLesson.objectives?.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* MAIN CONTENT */}
            <div>
              <h3 className="font-semibold mb-2">Lesson Content</h3>
              <p className="text-(--text-secondary) whitespace-pre-line">
                {currentLesson.content}
              </p>
            </div>

            {/* KEY CONCEPTS */}
            <div>
              <h3 className="font-semibold mb-2">Key Concepts</h3>
              <div className="flex flex-wrap gap-2">
                {currentLesson.keyConcepts?.map((concept, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-(--bg-muted) rounded-full"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* CODE BLOCK */}
            <div>
              <h3 className="font-semibold mb-2">Example Code</h3>
              <pre className="bg-black text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
                <code>{currentLesson.codeExample}</code>
              </pre>
            </div>

            {/* COMPLETE BUTTON */}
            <button
              onClick={() => toggleComplete(currentLesson.id)}
              className={`mt-4 px-6 py-3 rounded-xl ${
                completed.includes(currentLesson.id)
                  ? "bg-(--color-success) text-white"
                  : "bg-(--color-primary) text-white"
              }`}
            >
              {completed.includes(currentLesson.id)
                ? "Completed"
                : "Mark as Complete"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          {module.lessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentLesson(lesson)}
              className={`p-4 rounded-xl cursor-pointer border ${
                currentLesson.id === lesson.id
                  ? "border-(--color-primary) bg-(--bg-muted)"
                  : "border-(--border-color) bg-(--card-bg)"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{lesson.title}</h4>
                  <p className="text-xs text-(--text-secondary)">
                    {lesson.duration} min
                  </p>
                </div>

                {completed.includes(lesson.id) && (
                  <FiCheckCircle className="text-(--color-success)" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
