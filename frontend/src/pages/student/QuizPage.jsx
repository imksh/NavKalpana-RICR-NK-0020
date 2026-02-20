import { useEffect, useState } from "react";

const QuizPage = () => {
  const quiz = {
    title: "React Fundamentals Quiz",
    duration: 60, // seconds
    questions: [
      {
        questionText: "What is React?",
        options: [
          { text: "Library", isCorrect: true },
          { text: "Database", isCorrect: false },
          { text: "Server", isCorrect: false },
        ],
        explanation: "React is a JavaScript library.",
      },
      {
        questionText: "What is JSX?",
        options: [
          { text: "JavaScript Extension", isCorrect: true },
          { text: "JSON format", isCorrect: false },
        ],
        explanation: "JSX is syntax extension for JavaScript.",
      },
    ],
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, submitted]);

  const handleSelect = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentIndex]: optionIndex,
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      const selected = answers[index];
      if (q.options[selected]?.isCorrect) {
        correct++;
      }
    });

    return Math.round((correct / quiz.questions.length) * 100);
  };

  if (submitted || timeLeft === 0) {
    const score = calculateScore();

    return (
      <div className="min-h-dvh flex flex-col justify-center items-center bg-(--bg-main) text-(--text-primary) px-6 md:px-16">
        <h1 className="text-3xl font-semibold mb-4">Quiz Completed</h1>

        <p className="text-xl text-(--color-success)">Your Score: {score}%</p>

        <div className="w-full mt-8">
          {quiz.questions.map((q, index) => (
            <div
              key={index}
              className="mb-4 p-4 bg-(--card-bg) border border-(--border-color) rounded-xl"
            >
              <p className="font-medium">
                Q{index + 1}. {q.questionText}
              </p>

              <p className="text-sm mt-2">
                Correct Answer: {q.options.find((o) => o.isCorrect)?.text}
              </p>

              <p className="text-xs text-(--text-secondary) mt-1">
                {q.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">{quiz.title}</h1>

        <div className="text-(--color-danger) font-medium">
          Time Left: {timeLeft}s
        </div>
      </div>

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
              {option.text}
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
