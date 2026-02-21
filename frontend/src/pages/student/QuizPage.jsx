import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import QuizResultPage from "../../components/student/QuizResult";

const QuizPage = () => {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH QUIZ ================= */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/student/quizzes/${id}`);

        // 🔥 If already attempted → render result
        if (res.data.alreadyAttempted) {
          setAlreadyAttempted(true);
          return;
        }

        setQuiz(res.data);
        setTimeLeft(res.data.duration);
      } catch (error) {
        console.log("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!quiz || submitted || alreadyAttempted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, quiz, submitted, alreadyAttempted]);

  const handleSelect = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentIndex]: optionIndex,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      await api.post("/student/quizzes/submit", {
        quizId: quiz._id,
        answers,
      });

      setSubmitted(true); // 🔥 switch to result view
    } catch (error) {
      console.log("Submit error:", error);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Loading quiz...
      </div>
    );
  }

  /* ================= RESULT VIEW ================= */
  if (alreadyAttempted || submitted) {
    return <QuizResultPage quizId={id} />;
  }

  if (!quiz) return null;

  const question = quiz.questions[currentIndex];

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">{quiz.title}</h1>

        <div className="text-(--color-danger) font-medium">
          Time Left: {timeLeft}s
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>
            Question {currentIndex + 1} / {quiz.questions.length}
          </span>
          <span>
            {Math.round(((currentIndex + 1) / quiz.questions.length) * 100)}%
          </span>
        </div>

        <div className="w-full h-2 bg-(--bg-muted) rounded-full">
          <div
            className="h-2 bg-(--color-primary) rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">
        <h2 className="text-lg font-medium mb-4">
          Q{currentIndex + 1}. {question.questionText}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`w-full text-left p-3 rounded-xl border ${
                answers[currentIndex] === index
                  ? "border-(--color-primary) bg-(--bg-muted)"
                  : "border-(--border-color)"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="px-4 py-2 bg-(--bg-muted) rounded-xl"
          >
            Previous
          </button>

          {currentIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-(--color-primary) text-white rounded-xl"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="px-6 py-2 bg-(--color-primary) text-white rounded-xl"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
