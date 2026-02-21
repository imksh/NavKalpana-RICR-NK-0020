import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

const QuizResult = ({ quizId }) => {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(
          `/student/quizzes/${quizId}/result`
        );

        console.log(res.data);
        
        setResult(res.data); // ✅ store response
      } catch (error) {
        console.log("Error fetching result:", error);
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };

    fetchResult();
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Loading result...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        No result found.
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">

      {/* ===== HEADER ===== */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold mb-2">
          {result.title}
        </h1>

        <p className="text-2xl font-bold text-(--color-success)">
          {result.scorePercent}%
        </p>

        <p className="text-(--text-secondary)">
          {result.correctCount} / {result.totalQuestions} Correct
        </p>
      </div>

      {/* ===== QUESTIONS REVIEW ===== */}
      <div className="space-y-6">
        {result.questions.map((q, index) => {
          const isCorrect =
            q.selectedAnswerIndex === q.correctAnswerIndex;

          return (
            <div
              key={index}
              className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6"
            >
              <h3 className="font-medium mb-4">
                Q{index + 1}. {q.questionText}
              </h3>

              <div className="space-y-2">
                {q.options.map((option, optIndex) => {
                  const isSelected =
                    optIndex === q.selectedAnswerIndex;

                  const isAnswer =
                    optIndex === q.correctAnswerIndex;

                  return (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-xl 
                        ${
                          isAnswer
                            ? "border-(--color-success) border-2"
                            : isSelected && !isCorrect
                            ? "border-(--color-danger) border-2"
                            : "border-(--border-color) border"
                        }
                      `}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-sm text-(--text-secondary)">
                {q.explanation}
              </p>
            </div>
          );
        })}
      </div>

      {/* ===== BACK BUTTON ===== */}
      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/student/quizzes")}
          className="px-6 py-2 bg-(--color-primary) text-white rounded-xl"
        >
          Back to Quizzes
        </button>
      </div>
    </div>
  );
};

export default QuizResult;