import Assignment from "../models/assignment.model.js";
import Enrollment from "../models/enrollment.model.js";
import AssignmentSubmission from "../models/assignmentSubmission.model.js";
import Quiz from "../models/quiz.model.js";
import QuizResult from "../models/quiz.model.js";
import Course from "../models/course.model.js";
import LearningActivity from "../models/learningActivity.model.js";

export const stats = async (req, res, next) => {
  try {
    const user = req.user;

    const enrollments = await Enrollment.find({
      studentId: user._id,
    }).populate("courseId");

    const courseIds = enrollments.map((e) => e.courseId._id);
    const enrolledCourses = enrollments.map((e) => e.courseId);

    /* ================= ASSIGNMENTS ================= */

    const assignments = await Assignment.find({
      courseId: { $in: courseIds },
    });

    const totalAssignments = assignments.length;

    const assignmentSubmissions = await AssignmentSubmission.find({
      studentId: user._id,
      assignmentId: { $in: assignments.map((a) => a._id) },
      status: "Evaluated",
    });

    const submittedAssignments = assignmentSubmissions.length;

    const avgAssignmentMarks =
      assignmentSubmissions.length > 0
        ? Math.round(
            assignmentSubmissions.reduce(
              (sum, sub) => sum + (sub.marks || 0),
              0,
            ) / assignmentSubmissions.length,
          )
        : 0;

    /* ================= QUIZZES ================= */

    const quizzes = await Quiz.find({
      courseId: { $in: courseIds },
    });

    const totalQuizzes = quizzes.length;

    const quizResults = await QuizResult.find({
      studentId: user._id,
      quizId: { $in: quizzes.map((q) => q._id) },
    });

    const attemptedQuizzes = quizResults.length;

    const avgQuizScore =
      quizResults.length > 0
        ? Math.round(
            quizResults.reduce(
              (sum, result) => sum + (result.scorePercent || 0),
              0,
            ) / quizResults.length,
          )
        : 0;

    /* ================= SKILLS ================= */

    let totalSkills = 0;

    enrollments.forEach((item) => {
      if (item.courseId?.skills) {
        totalSkills += item.courseId.skills.length;
      }
    });

    const skillsAcquired = user.skillsAcquired?.length || 0;

    /* ================= LONGEST STREAK ================= */

    const activityDates = await LearningActivity.aggregate([
      { $match: { studentId: user._id } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const longestStreak = calculateLongestStreak(
      activityDates.map((d) => d._id),
    );

    const streak = calculateStreak(activityDates.map((d) => d._id));

    /* ================= RESPONSE ================= */

    res.status(200).json({
      totalCourses: enrollments.length,
      totalAssignments,
      submittedAssignments,
      avgAssignmentMarks,
      totalQuizzes,
      attemptedQuizzes,
      avgQuizScore,
      totalSkills,
      skillsAcquired,
      longestStreak,
      streak,
      enrolledCourses,
    });
  } catch (error) {
    console.log("Error in stats:", error);
    next(error);
  }
};

export const getLearningActivity = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const activity = await LearningActivity.aggregate([
      { $match: { studentId } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    const streak = calculateStreak(activity);

    res.status(200).json({ activity, streak });
  } catch (error) {
    console.log("Error in getLearningActivity:", error);
    next(error);
  }
};

export const getStudentProgress = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    /* ================= COURSES ================= */
    const enrollments = await Enrollment.find({ studentId }).populate(
      "courseId",
    );

    const courseProgress = enrollments.map((e) => {
      const totalLessons = e.courseId.totalLessons || 1;
      const progress = Math.round(
        (e.completedLessons.length / totalLessons) * 100,
      );

      return {
        _id: e.courseId._id,
        name: e.courseId.title.en,
        progress,
      };
    });

    /* ================= OVERALL PROGRESS ================= */
    const overallProgress =
      courseProgress.length > 0
        ? Math.round(
            courseProgress.reduce((acc, c) => acc + c.progress, 0) /
              courseProgress.length,
          )
        : 0;

    /* ================= QUIZ AVG ================= */
    const quizResults = await QuizResult.find({ studentId });
    const avgQuizScore =
      quizResults.length > 0
        ? Math.round(
            quizResults.reduce((acc, q) => acc + (q.scorePercent || 0), 0) /
              quizResults.length,
          )
        : 0;

    /* ================= ASSIGNMENT AVG ================= */
    const assignments = await AssignmentSubmission.find({
      studentId,
      status: "Evaluated",
    });

    const avgAssignmentScore =
      assignments.length > 0
        ? Math.round(
            assignments.reduce((acc, a) => acc + (a.marks || 0), 0) /
              assignments.length,
          )
        : 0;

    /* ================= SKILLS ================= */
    let totalSkills = 0;
    enrollments.forEach((e) => {
      totalSkills += e.courseId.skills?.length || 0;
    });

    const skillsAcquired = req.user.skillsAcquired || [];

    /* ================= SIMPLE AI INSIGHT ================= */
    let insight = "Keep pushing forward!";

    if (avgQuizScore > avgAssignmentScore) {
      insight =
        "You perform stronger in quizzes than assignments. Focus on assignment consistency.";
    } else if (avgAssignmentScore > avgQuizScore) {
      insight =
        "Strong assignment performance. Improve quiz accuracy for better overall score.";
    }

    res.status(200).json({
      overallProgress,
      courseProgress,
      avgQuizScore,
      avgAssignmentScore,
      skills: skillsAcquired,
      insight,
    });
  } catch (error) {
    console.log("Error in getStudentProgress:", error);
    next(error);
  }
};

//helpers

const calculateStreak = (dates) => {
  if (!dates.length) return 0;

  let streak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let expectedDate = today;

  for (let i = 0; i < dates.length; i++) {
    const activityDate = new Date(dates[i].date);
    activityDate.setHours(0, 0, 0, 0);

    const diff = (expectedDate - activityDate) / (1000 * 60 * 60 * 24);

    if (diff === 0) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (diff === 1 && streak === 0) {
      // allow streak to start from yesterday
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 2);
    } else {
      break;
    }
  }

  return streak;
};

const calculateLongestStreak = (dateStrings) => {
  if (!dateStrings.length) return 0;

  const dates = dateStrings.map((d) => new Date(d));

  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = dates[i - 1];
    const curr = dates[i];

    const diff = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
};
