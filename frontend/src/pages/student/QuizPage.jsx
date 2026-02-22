import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import QuizResultPage from "../../components/student/QuizResult";
import { FiCheckCircle, FiClock, FiHelpCircle, FiTarget } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const QuizPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizMeta, setQuizMeta] = useState(null);
  const [allQuizzes, setAllQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const [quizRes, listRes] = await Promise.all([
          api.get(`/student/quizzes/${id}`),
          api.get("/student/quizzes"),
        ]);

        const quizzes = listRes.data || [];
        setAllQuizzes(quizzes);
        setQuizMeta(quizzes.find((item) => item._id === id) || null);

        if (quizRes.data.alreadyAttempted) {
          setAlreadyAttempted(true);
          return;
        }

        setQuiz(quizRes.data);
        setTimeLeft(quizRes.data.duration);
      } catch (error) {
        console.log("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSelect = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentIndex]: optionIndex,
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!quiz) return;

    try {
      await api.post("/student/quizzes/submit", {
        quizId: quiz._id,
        answers,
      });

      setSubmitted(true);
    } catch (error) {
      console.log("Submit error:", error);
    }
  }, [quiz, answers]);

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
  }, [timeLeft, quiz, submitted, alreadyAttempted, handleSubmit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        {t("quizPage.loading")}
      </div>
    );
  }

  if (alreadyAttempted || submitted) {
    return <QuizResultPage quizId={id} />;
  }

  if (!quiz) return null;

  const question = quiz.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round(
    ((currentIndex + 1) / quiz.questions.length) * 100,
  );
  const questionProgress = Math.round(
    (answeredCount / quiz.questions.length) * 100,
  );

  const attemptedWithScore = allQuizzes.filter(
    (q) => q.attempted && typeof q.score === "number",
  );
  const averageScore =
    attemptedWithScore.length > 0
      ? Math.round(
          attemptedWithScore.reduce((sum, q) => sum + q.score, 0) /
            attemptedWithScore.length,
        )
      : null;

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-4 md:px-10 lg:px-16 pt-10 md:pt-14 pb-16 space-y-6">
      <section className="rounded-3xl border border-(--border-color) bg-(--bg-surface) p-5 md:p-7 shadow-sm">
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-4xl font-semibold leading-tight">
              {quiz.title}
            </h1>

            <p className="mt-2 text-(--text-secondary)">
              {quizMeta?.course || t("quizPage.assessment")} •{" "}
              {quiz.totalQuestions} {t("quizPage.questions")}
            </p>

            <div className="mt-5">
              <div className="flex justify-between text-sm mb-2">
                <span>
                  {t("quizPage.question")} {currentIndex + 1} /{" "}
                  {quiz.questions.length}
                </span>
                <span>{progress}%</span>
              </div>

              <div className="w-full h-2 bg-(--bg-muted) rounded-full overflow-hidden">
                <div
                  className="h-2 bg-(--color-primary) rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <StatCard
              icon={<FiClock size={14} />}
              label={t("quizPage.timeLeft")}
              value={formatTime(timeLeft)}
              danger={timeLeft <= 60}
            />
            <StatCard
              icon={<FiCheckCircle size={14} />}
              label={t("quizPage.answered")}
              value={`${answeredCount}/${quiz.questions.length}`}
            />
            <StatCard
              icon={<FiTarget size={14} />}
              label={t("quizPage.avgScore")}
              value={
                averageScore !== null ? `${averageScore}%` : t("common.na")
              }
            />
          </div>
        </div>

        <div className="mt-5 text-xs text-(--text-secondary)">
          {t("quizPage.progress")}: {questionProgress}%
        </div>
      </section>

      <div className="grid lg:grid-cols-4 gap-5 md:gap-6">
        <section className="lg:col-span-3 bg-(--card-bg) border border-(--border-color) p-5 md:p-6 rounded-2xl">
          <h2 className="text-lg md:text-xl font-medium mb-4 inline-flex items-start gap-2">
            <FiHelpCircle className="mt-0.5 text-(--color-primary)" />
            <span>
              Q{currentIndex + 1}. {question.questionText}
            </span>
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-all ${
                  answers[currentIndex] === index
                    ? "border-(--color-primary) bg-(--bg-muted)"
                    : "border-(--border-color) hover:bg-(--bg-muted)"
                }`}
              >
                <span className="font-medium mr-2 text-(--text-secondary)">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="px-4 py-2 bg-(--bg-muted) rounded-xl disabled:opacity-50 cursor-pointer"
            >
              {t("quizPage.previous")}
            </button>

            {currentIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-(--color-primary) text-white rounded-xl cursor-pointer hover:bg-(--color-primary-hover)"
              >
                {t("quizPage.submit")}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="px-6 py-2 bg-(--color-primary) text-white rounded-xl cursor-pointer hover:bg-(--color-primary-hover)"
              >
                {t("quizPage.next")}
              </button>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4">
            <h3 className="font-semibold mb-3">{t("quizPage.navigator")}</h3>
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((_, index) => {
                const isCurrent = index === currentIndex;
                const isAnswered = answers[index] !== undefined;

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-9 rounded-lg text-sm cursor-pointer border transition-all ${
                      isCurrent
                        ? "border-(--color-primary) bg-(--bg-muted)"
                        : isAnswered
                          ? "border-(--color-success)"
                          : "border-(--border-color)"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4">
            <h3 className="font-semibold mb-2">{t("quizPage.summary")}</h3>
            <p className="text-sm text-(--text-secondary)">
              {t("quizPage.duration")}: {Math.round((quiz.duration || 0) / 60)}{" "}
              {t("quizPage.min")}
            </p>
            <p className="text-sm text-(--text-secondary)">
              {t("quizPage.questions")}: {quiz.questions.length}
            </p>
            <p className="text-sm text-(--text-secondary)">
              {t("quizPage.answered")}: {answeredCount}
            </p>

            {currentIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="w-full mt-4 px-4 py-2 bg-(--color-primary) text-white rounded-xl cursor-pointer hover:bg-(--color-primary-hover)"
              >
                {t("quizPage.submitQuiz")}
              </button>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, danger }) => (
  <div className="rounded-xl border border-(--border-color) bg-(--card-bg) p-3">
    <p className="text-xs text-(--text-muted) inline-flex items-center gap-1">
      <span className="text-(--color-primary)">{icon}</span>
      {label}
    </p>
    <p
      className={`font-semibold mt-1 ${danger ? "text-(--color-danger)" : ""}`}
    >
      {value}
    </p>
  </div>
);

export default QuizPage;
