import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../config/api";

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/student/quizzes");
        setQuizzes(res.data);
      } catch (error) {
        console.log("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Loading quizzes...
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">

      <h1 className="text-3xl font-semibold mb-10">
        Quizzes
      </h1>

      {quizzes.length === 0 ? (
        <p className="text-(--text-secondary)">
          No quizzes available.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz._id}
              whileHover={{ y: -5 }}
              className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-2">
                {quiz.title}
              </h3>

              <p className="text-sm text-(--text-secondary) mb-2">
                {quiz.course}
              </p>

              <p className="text-sm mb-4">
                {quiz.totalQuestions} Questions • {quiz.duration} mins
              </p>

              {quiz.attempted ? (
                <p className="text-(--color-success) font-medium mb-4">
                  Score: {quiz.score}%
                </p>
              ) : (
                <p className="text-(--color-warning) mb-4">
                  Not Attempted
                </p>
              )}

              <button
                onClick={() =>
                  navigate(`/student/quizzes/${quiz._id}`)
                }
                className="w-full py-2 rounded-xl bg-(--color-primary) text-white hover:bg-(--color-primary-hover)"
              >
                {quiz.attempted ? "View Result" : "Start Quiz"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;