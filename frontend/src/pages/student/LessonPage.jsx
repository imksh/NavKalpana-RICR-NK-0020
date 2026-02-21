import { useState, useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import useUiStore from "../../store/useUiStore";
import { LuClipboard } from "react-icons/lu";
import toast from "react-hot-toast";

const LessonPage = () => {
  const { course, slug } = useParams();
  const navigate = useNavigate();
  const { lang } = useUiStore();

  const [lesson, setLesson] = useState(null);
  const [moduleLessons, setModuleLessons] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH LESSON ================= */
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`course/lesson/${slug}`);
        setLesson(res.data);

        // fetch all lessons in same module
        const moduleRes = await api.get(
          `/course/module/${res.data.moduleId}/lessons`,
        );
        setModuleLessons(moduleRes.data);
      } catch (error) {
        console.log("Error fetching lesson:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [slug]);

  const toggleComplete = (id) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  };

  if (loading || !lesson) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Loading lesson...
      </div>
    );
  }

  const progressPercent =
    moduleLessons.length > 0
      ? Math.round((completed.length / moduleLessons.length) * 100)
      : 0;

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      {/* HEADER */}
      <div className="mb-10">
        <button
          onClick={() => navigate(`/student/courses/${course}`)}
          className="text-(--color-primary) mb-4"
        >
          ← Back to Module
        </button>

        <h1 className="text-3xl font-semibold">{lesson.title?.[lang]}</h1>

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
        {/* MAIN */}
        <div className="md:col-span-2 space-y-6">
          {/* VIDEO */}
          {lesson.videoUrl && (
            <div className="rounded-2xl overflow-hidden shadow-md">
              <iframe
                src={lesson.videoUrl.replace("watch?v=", "embed/")}
                title="Lesson Video"
                className="w-full h-80"
                allowFullScreen
              />
            </div>
          )}

          <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl space-y-6">
            <p className="text-sm text-(--text-secondary)">
              {lesson.difficulty} • {lesson.estimatedDurationMinutes} min
            </p>

            {/* Objectives */}
            {lesson.objectives?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Learning Objectives</h3>
                <ul className="list-disc list-inside text-(--text-secondary)">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i}>{obj?.[lang]}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Content */}
            {lesson.content?.[lang] && (
              <div>
                <h3 className="font-semibold mb-2">Lesson Content</h3>
                <p className="text-(--text-secondary) whitespace-pre-line">
                  {lesson.content[lang]}
                </p>
              </div>
            )}

            {/* Concepts */}
            {lesson.keyConcepts?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {lesson.keyConcepts.map((concept, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-(--bg-muted) rounded-full"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Code */}
            {lesson.codeExample && (
              <div>
                <h3 className="font-semibold mb-2">Code</h3>
                <pre className="bg-black text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(lesson.codeExample);
                      toast.success("Code copied to clipboard!");
                    }}
                    className="float-right text-white hover:text-(--color-primary) transition cursor-pointer"
                    title="Copy"
                  >
                    <LuClipboard className="text-lg" />
                  </motion.button>
                  <code>{lesson.codeExample}</code>
                </pre>
              </div>
            )}

            {/* Complete */}
            <button
              onClick={() => toggleComplete(lesson._id)}
              className={`mt-4 px-6 py-3 rounded-xl ${
                completed.includes(lesson._id)
                  ? "bg-(--color-success) text-white"
                  : "bg-(--color-primary) text-white"
              }`}
            >
              {completed.includes(lesson._id)
                ? "Completed"
                : "Mark as Complete"}
            </button>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          {moduleLessons.map((l) => (
            <motion.div
              key={l._id}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/student/courses/${course}/${l.slug}`)}
              className={`p-4 rounded-xl cursor-pointer border ${
                l.slug === slug
                  ? "border-(--color-primary) bg-(--bg-muted)"
                  : "border-(--border-color) bg-(--card-bg)"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{l.title?.[lang]}</h4>
                  <p className="text-xs text-(--text-secondary)">
                    {l.estimatedDurationMinutes} min
                  </p>
                </div>

                {completed.includes(l._id) && (
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

export default LessonPage;
