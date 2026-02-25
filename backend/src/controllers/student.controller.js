import Assignment from "../models/assignment.model.js";
import Enrollment from "../models/enrollment.model.js";
import AssignmentSubmission from "../models/assignmentSubmission.model.js";
import Quiz from "../models/quiz.model.js";
import QuizResult from "../models/quizResult.model.js";
import Course from "../models/course.model.js";
import LearningActivity from "../models/learningActivity.model.js";
import Attendance from "../models/attendance.model.js";
import User from "../models/user.model.js";
import Event from "../models/event.model.js";
import { updateLearningStreak } from "../utils/updateLearningStreak.js";

export const stats = async (req, res, next) => {
  try {
    const user = req.user;

    const enrollments = await Enrollment.find({
      studentId: user._id,
    }).populate("courseId");

    const courseIds = enrollments.map((e) => e.courseId._id);
    const enrolledCourses = enrollments.map((e) => e.courseId);

    const assignments = await Assignment.find({
      courseId: { $in: courseIds },
    });

    const totalAssignments = assignments.length;

    const assignmentSubmissions = await AssignmentSubmission.find({
      studentId: user._id,
      status: "Evaluated",
      assignmentId: { $in: assignments.map((a) => a._id) },
    });

    const allAssignmentSubmissions = await AssignmentSubmission.find({
      studentId: user._id,
      assignmentId: { $in: assignments.map((a) => a._id) },
    });

    const submittedAssignments = assignmentSubmissions.length;

    const gradedSubmissions = assignmentSubmissions.filter(
      (sub) => sub.marks != null,
    );

    const avgAssignmentMarks =
      gradedSubmissions.length > 0
        ? Math.round(
            gradedSubmissions.reduce((sum, sub) => sum + sub.marks, 0) /
              gradedSubmissions.length,
          )
        : 0;

    const onTimeSubmissions = new Set(
      allAssignmentSubmissions
        .filter((sub) => !sub.isLate && sub.status !== "Late Submitted")
        .map((sub) => sub.assignmentId.toString()),
    ).size;

    const consistencyPercent =
      totalAssignments > 0
        ? Math.round((onTimeSubmissions / totalAssignments) * 100)
        : 0;

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

    console.log(streak);

    const attendanceRecords = await Attendance.find({
      studentId: user._id,
      courseId: { $in: courseIds },
    });

    const totalClasses = attendanceRecords.length;

    const presentCount = attendanceRecords.filter(
      (a) => a.status === "Present",
    ).length;

    const attendancePercent =
      totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    let courseCompletionPercent = 0;

    if (enrollments.length > 0) {
      const totalPercent = enrollments.reduce(
        (sum, enrollment) => sum + (enrollment.progressPercent || 0),
        0,
      );
      courseCompletionPercent = Math.round(totalPercent / enrollments.length);
    }

    const overallScore = calculateOverallScore({
      avgAssignmentMarks,
      avgQuizScore,
      courseCompletionPercent,
      consistencyPercent,
    });

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
      overallScore,
      attendancePercent,
      courseCompletionPercent,
      consistencyPercent,
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

    const streak = calculateStreak(activity.map((a) => a.date));

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

export const getUpcomingEvents = async (req, res, next) => {
  try {
    const now = new Date();

    const events = await Event.find({
      isActive: true,
      startDate: { $gte: now },
    })
      .sort({ startDate: 1 })
      .limit(10);

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({}).sort({ startDate: -1 });

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const leaderboard = async (req, res, next) => {
  try {
    const currentUserId = req.user._id.toString();

    const students = await User.aggregate([
      { $match: { role: "student", isActive: true } },

      /* ================= QUIZ AVG ================= */
      {
        $lookup: {
          from: "quizresults",
          localField: "_id",
          foreignField: "studentId",
          as: "quizResults",
        },
      },
      {
        $addFields: {
          validQuizResults: {
            $filter: {
              input: "$quizResults",
              as: "q",
              cond: { $ne: ["$$q.scorePercent", null] },
            },
          },
        },
      },
      {
        $addFields: {
          avgQuizScore: {
            $cond: [
              { $gt: [{ $size: "$validQuizResults" }, 0] },
              { $ifNull: [{ $avg: "$validQuizResults.scorePercent" }, 0] },
              0,
            ],
          },
        },
      },

      /* ================= ASSIGNMENT AVG ================= */
      {
        $lookup: {
          from: "assignmentsubmissions",
          localField: "_id",
          foreignField: "studentId",
          as: "assignmentSubmissions",
        },
      },
      {
        $addFields: {
          gradedSubmissions: {
            $filter: {
              input: "$assignmentSubmissions",
              as: "sub",
              cond: {
                $and: [
                  { $eq: ["$$sub.status", "Evaluated"] },
                  { $ne: ["$$sub.marks", null] },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          avgAssignmentMarks: {
            $cond: [
              { $gt: [{ $size: "$gradedSubmissions" }, 0] },
              { $ifNull: [{ $avg: "$gradedSubmissions.marks" }, 0] },
              0,
            ],
          },
        },
      },

      /* ================= ENROLLMENT & ASSIGNMENTS ================= */
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "studentId",
          as: "enrollments",
        },
      },
      {
        $lookup: {
          from: "assignments",
          let: { courseIds: "$enrollments.courseId" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$courseId", "$$courseIds"] },
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
          ],
          as: "assignments",
        },
      },

      /* ================= COURSE COMPLETION ================= */
      {
        $addFields: {
          courseCompletionPercent: {
            $cond: [
              { $gt: [{ $size: "$enrollments" }, 0] },
              {
                $round: [
                  {
                    $avg: "$enrollments.progressPercent",
                  },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },

      /* ================= CONSISTENCY ================= */
      {
        $addFields: {
          totalAssignments: { $size: "$assignments" },
          onTimeSubmittedAssignmentIds: {
            $setUnion: [
              {
                $map: {
                  input: {
                    $filter: {
                      input: "$assignmentSubmissions",
                      as: "sub",
                      cond: {
                        $and: [
                          { $ne: ["$$sub.isLate", true] },
                          { $ne: ["$$sub.status", "Late Submitted"] },
                        ],
                      },
                    },
                  },
                  as: "sub",
                  in: "$$sub.assignmentId",
                },
              },
              [],
            ],
          },
        },
      },
      {
        $addFields: {
          consistencyPercent: {
            $cond: [
              { $gt: ["$totalAssignments", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $size: "$onTimeSubmittedAssignmentIds" },
                          "$totalAssignments",
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },

      /* ================= FINAL SCORE ================= */
      {
        $addFields: {
          score: {
            $round: [
              {
                $add: [
                  {
                    $multiply: [{ $ifNull: ["$avgQuizScore", 0] }, 0.4],
                  },
                  {
                    $multiply: [{ $ifNull: ["$avgAssignmentMarks", 0] }, 0.3],
                  },
                  {
                    $multiply: [
                      { $ifNull: ["$courseCompletionPercent", 0] },
                      0.2,
                    ],
                  },
                  {
                    $multiply: [{ $ifNull: ["$consistencyPercent", 0] }, 0.1],
                  },
                ],
              },
              0,
            ],
          },
        },
      },

      { $sort: { score: -1 } },

      {
        $project: {
          name: 1,
          photo: 1,
          score: 1,
        },
      },
    ]);

    /* ================= RANKING ================= */
    const ranked = students.map((student, index) => ({
      ...student,
      rank: index + 1,
    }));

    const top5 = ranked.slice(0, 5);

    const currentUser = ranked.find((s) => s._id.toString() === currentUserId);

    const isInTop5 = top5.some((s) => s._id.toString() === currentUserId);

    let response;

    if (isInTop5) {
      response = top5;
    } else if (currentUser) {
      response = [...top5, currentUser];
    } else {
      response = top5;
    }

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const growthDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ studentId }).populate(
      "courseId",
      "title progressPercent",
    );

    const courseIds = enrollments
      .map((item) => item.courseId?._id)
      .filter(Boolean);

    const assignments = await Assignment.find(
      {
        courseId: { $in: courseIds },
      },
      {
        _id: 1,
        courseId: 1,
      },
    );

    const assignmentIds = assignments.map((item) => item._id);

    const [submissions, quizzes, attendanceRecords] = await Promise.all([
      AssignmentSubmission.find(
        {
          studentId,
          assignmentId: { $in: assignmentIds },
        },
        {
          assignmentId: 1,
          marks: 1,
          status: 1,
          isLate: 1,
          createdAt: 1,
        },
      ),
      Quiz.find(
        {
          courseId: { $in: courseIds },
        },
        { _id: 1 },
      ),
      Attendance.find(
        {
          studentId,
          courseId: { $in: courseIds },
        },
        {
          status: 1,
          date: 1,
        },
      ),
    ]);

    const quizIds = quizzes.map((item) => item._id);

    const quizResults = await QuizResult.find(
      {
        studentId,
        quizId: { $in: quizIds },
      },
      {
        scorePercent: 1,
        createdAt: 1,
      },
    );

    const gradedSubmissions = submissions.filter(
      (item) => item.status === "Evaluated" && item.marks != null,
    );

    const avgAssignmentMarks =
      gradedSubmissions.length > 0
        ? Math.round(
            gradedSubmissions.reduce((sum, item) => sum + item.marks, 0) /
              gradedSubmissions.length,
          )
        : 0;

    const avgQuizScore =
      quizResults.length > 0
        ? Math.round(
            quizResults.reduce(
              (sum, item) => sum + (item.scorePercent || 0),
              0,
            ) / quizResults.length,
          )
        : 0;

    const courseCompletionPercent =
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce(
              (sum, item) => sum + (item.progressPercent || 0),
              0,
            ) / enrollments.length,
          )
        : 0;

    const onTimeSubmissionIds = new Set(
      submissions
        .filter(
          (item) => item.isLate !== true && item.status !== "Late Submitted",
        )
        .map((item) => item.assignmentId?.toString())
        .filter(Boolean),
    );

    const consistencyPercent =
      assignments.length > 0
        ? Math.round((onTimeSubmissionIds.size / assignments.length) * 100)
        : 0;

    const currentOgi = calculateOverallScore({
      avgAssignmentMarks,
      avgQuizScore,
      courseCompletionPercent,
      consistencyPercent,
    });

    const now = new Date();
    const currentWeekStart = getWeekStartDate(now);
    const weeks = 8;

    const weeklyHistory = Array.from({ length: weeks }).map((_, index) => {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(currentWeekStart.getDate() - (weeks - 1 - index) * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const submissionsTillWeek = submissions.filter(
        (item) => item.createdAt && new Date(item.createdAt) < weekEnd,
      );

      const gradedTillWeek = submissionsTillWeek.filter(
        (item) => item.status === "Evaluated" && item.marks != null,
      );

      const quizResultsTillWeek = quizResults.filter(
        (item) => item.createdAt && new Date(item.createdAt) < weekEnd,
      );

      const onTimeTillWeekIds = new Set(
        submissionsTillWeek
          .filter(
            (item) => item.isLate !== true && item.status !== "Late Submitted",
          )
          .map((item) => item.assignmentId?.toString())
          .filter(Boolean),
      );

      const weeklyAttendance = attendanceRecords.filter((item) => {
        if (!item.date) return false;
        const date = new Date(item.date);
        return date >= weekStart && date < weekEnd;
      });

      const weeklyPresent = weeklyAttendance.filter(
        (item) => item.status === "Present",
      ).length;

      const weeklyAttendancePercent =
        weeklyAttendance.length > 0
          ? Math.round((weeklyPresent / weeklyAttendance.length) * 100)
          : 0;

      const weeklyAssignmentsSubmitted = submissions.filter((item) => {
        if (!item.createdAt) return false;
        const date = new Date(item.createdAt);
        return date >= weekStart && date < weekEnd;
      }).length;

      const weeklyQuizzesAttempted = quizResults.filter((item) => {
        if (!item.createdAt) return false;
        const date = new Date(item.createdAt);
        return date >= weekStart && date < weekEnd;
      }).length;

      const weekAvgAssignment =
        gradedTillWeek.length > 0
          ? Math.round(
              gradedTillWeek.reduce((sum, item) => sum + item.marks, 0) /
                gradedTillWeek.length,
            )
          : 0;

      const weekAvgQuiz =
        quizResultsTillWeek.length > 0
          ? Math.round(
              quizResultsTillWeek.reduce(
                (sum, item) => sum + (item.scorePercent || 0),
                0,
              ) / quizResultsTillWeek.length,
            )
          : 0;

      const weekConsistency =
        assignments.length > 0
          ? Math.round((onTimeTillWeekIds.size / assignments.length) * 100)
          : 0;

      const weekOgi = calculateOverallScore({
        avgAssignmentMarks: weekAvgAssignment,
        avgQuizScore: weekAvgQuiz,
        courseCompletionPercent,
        consistencyPercent: weekConsistency,
      });

      return {
        weekStart: weekStart.toISOString().split("T")[0],
        weekLabel: formatWeekLabel(weekStart),
        ogi: weekOgi,
        quizAverage: weekAvgQuiz,
        assignmentAverage: weekAvgAssignment,
        completionRate: courseCompletionPercent,
        consistency: weekConsistency,
        attendancePercent: weeklyAttendancePercent,
        assignmentsSubmitted: weeklyAssignmentsSubmitted,
        quizzesAttempted: weeklyQuizzesAttempted,
      };
    });

    const moduleCompletionOverview = enrollments.map((item) => ({
      courseId: item.courseId?._id,
      courseName: item.courseId?.title?.en || "Course",
      completionPercent: item.progressPercent || 0,
    }));

    res.status(200).json({
      current: {
        ogi: currentOgi,
        classification: getOgiClassification(currentOgi),
        quizAverage: avgQuizScore,
        assignmentAverage: avgAssignmentMarks,
        completionRate: courseCompletionPercent,
        consistency: consistencyPercent,
      },
      moduleCompletionOverview,
      weeklyTrend: weeklyHistory.map((item) => ({
        weekLabel: item.weekLabel,
        ogi: item.ogi,
      })),
      weeklyHistory,
    });
  } catch (error) {
    console.log("Error in growthDashboard:", error);
    next(error);
  }
};

export const lessonOpened = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { courseId, lessonId } = req.body;

    const isDuplicate = await LearningActivity.findOne({
      studentId,
      actionType: "lesson_opened",
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    if (isDuplicate) {
      return res
        .status(200)
        .json({ message: "Activity already recorded for today" });
    }

    /* ===== CREATE ACTIVITY ===== */
    await LearningActivity.create({
      studentId,
      courseId,
      actionType: "lesson_opened",
      referenceId: lessonId,
    });

    /* ===== UPDATE STREAK ===== */
    await updateLearningStreak(studentId);

    res.status(200).json({ message: "Activity recorded" });
  } catch (error) {
    console.log("Error in lessonOpened:", error);
    next(error);
  }
};

//helpers

const calculateStreak = (dateStrings) => {
  if (!dateStrings.length) return 0;

  const dates = dateStrings
    .map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date;
    })
    .sort((a, b) => b - a);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffFromToday = (today - dates[0]) / (1000 * 60 * 60 * 24);

  // If last activity not today or yesterday → streak broken
  if (diffFromToday > 1) {
    return 0;
  }

  let streak = 1;
  let expectedDate = new Date(dates[0]);

  for (let i = 1; i < dates.length; i++) {
    const diff = (expectedDate - dates[i]) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

const calculateLongestStreak = (dateStrings) => {
  if (!dateStrings.length) return 0;

  // Normalize, remove duplicates, sort ascending
  const dates = [...new Set(dateStrings)]
    .map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date;
    })
    .sort((a, b) => a - b);

  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diff > 1) {
      current = 1;
    }
  }

  return longest;
};

const getWeekStartDate = (inputDate) => {
  const date = new Date(inputDate);
  date.setHours(0, 0, 0, 0);

  const day = date.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - diffToMonday);

  return date;
};

const formatWeekLabel = (weekStartDate) => {
  return weekStartDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getOgiClassification = (ogi = 0) => {
  if (ogi >= 85) return { label: "Excellent", color: "green" };
  if (ogi >= 70) return { label: "Improving", color: "blue" };
  if (ogi >= 50) return { label: "Stable", color: "yellow" };
  return { label: "Needs Attention", color: "red" };
};

const calculateOverallScore = ({
  avgAssignmentMarks = 0,
  avgQuizScore = 0,
  courseCompletionPercent = 0,
  consistencyPercent = 0,
}) => {
  return Math.round(
    avgQuizScore * 0.4 +
      avgAssignmentMarks * 0.3 +
      courseCompletionPercent * 0.2 +
      consistencyPercent * 0.1,
  );
};
