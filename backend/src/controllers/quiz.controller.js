import Quiz from "../models/quiz.model.js";
import QuizResult from "../models/quizResult.model.js";
import Enrollment from "../models/enrollment.model.js";
import mongoose from "mongoose";

export const getStudentQuizzes = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    /* ===== Get enrolled courses ===== */
    const enrollments = await Enrollment.find({ studentId });
    const courseIds = enrollments.map((e) => e.courseId);

    /* ===== Get quizzes for those courses ===== */
    const quizzes = await Quiz.find({
      courseId: { $in: courseIds },
      isActive: true,
    }).populate("courseId", "title");

    /* ===== Get quiz results for student ===== */
    const results = await QuizResult.find({
      studentId,
    });

    const resultMap = {};
    results.forEach((r) => {
      resultMap[r.quizId.toString()] = r;
    });

    const formatted = quizzes.map((q) => {
      const result = resultMap[q._id.toString()];

      return {
        _id: q._id,
        title: q.title,
        course: q.courseId?.title?.en || "Course",
        duration: q.durationMinutes,
        totalQuestions: q.totalQuestions,
        attempted: !!result,
        score: result?.scorePercent || null,
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.log("Error in getStudentQuizzes:", error);
    next(error);
  }
};

export const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    const quiz = await Quiz.findById(id);

    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 🔒 Check if already attempted
    const existingResult = await QuizResult.findOne({
      studentId,
      quizId: id,
    });

    // 🚫 Remove correct answers before sending
    const sanitizedQuestions = quiz.questions.map((q) => ({
      questionText: q.questionText,
      explanation: q.explanation,
      options: q.options.map((o) => o.text),
    }));

    if (existingResult) {
      return res.status(200).json({
        _id: quiz._id,
        title: quiz.title,
        duration: quiz.durationMinutes * 60,
        totalQuestions: quiz.questions.length,
        questions: sanitizedQuestions,
        alreadyAttempted: !!existingResult,
      });
    }

    res.status(200).json({
      _id: quiz._id,
      title: quiz.title,
      duration: quiz.durationMinutes * 60, // convert to seconds
      totalQuestions: quiz.questions.length,
      questions: sanitizedQuestions,
    });
  } catch (error) {
    console.log("Error in getQuizById:", error);
    next(error);
  }
};

/* ================= SUBMIT QUIZ ================= */
export const submitQuiz = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const existing = await QuizResult.findOne({
      studentId,
      quizId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Quiz already submitted",
      });
    }

    let correctCount = 0;
    const answerDetails = [];

    quiz.questions.forEach((q, index) => {
      const selected = answers[index];

      const correctIndex = q.options.findIndex((o) => o.isCorrect);

      const isCorrect = selected === correctIndex;

      if (isCorrect) correctCount++;

      answerDetails.push({
        questionIndex: index,
        selectedAnswerIndex: selected ?? null,
        correctAnswerIndex: correctIndex,
        isCorrect,
      });
    });

    const totalQuestions = quiz.questions.length;

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    const result = await QuizResult.create({
      studentId,
      quizId,
      scorePercent,
      correctCount,
      totalQuestions,
      answers: answerDetails, // 🔥 SAVE ANSWERS
    });

    res.status(200).json({
      scorePercent,
      correctCount,
      totalQuestions,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizResult = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params; // quizId

    /* ===== Find Result ===== */
    const result = await QuizResult.findOne({
      studentId,
      quizId: id,
    });

    if (!result) {
      return res.status(404).json({
        message: "Quiz not attempted yet",
      });
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const questions = quiz.questions.map((q, index) => {
      const correctIndex = q.options.findIndex((opt) => opt.isCorrect);

      return {
        questionText: q.questionText,
        options: q.options.map((opt) => opt.text),
        correctAnswerIndex: correctIndex,
        selectedAnswerIndex:
          result.answers?.[index]?.selectedAnswerIndex ?? null,
        explanation: q.explanation,
      };
    });

    res.status(200).json({
      title: quiz.title,
      scorePercent: result.scorePercent,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      submittedAt: result.submittedAt,
      questions,
    });
  } catch (error) {
    console.log("Error in getQuizResult:", error);
    next(error);
  }
};
