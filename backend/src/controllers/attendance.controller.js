import Enrollment from "../models/enrollment.model.js";
import Attendance from "../models/attendance.model.js";
import mongoose from "mongoose";

export const getStudentAttendance = async (req, res, next) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.user._id);

    /* ===== Get enrolled courses ===== */
    const enrollments = await Enrollment.find({ studentId })
      .populate("courseId", "title");

    const courseIds = enrollments.map(e => e.courseId._id);

    /* ===== Get all attendance records ===== */
    const allAttendance = await Attendance.find({
      studentId,
      courseId: { $in: courseIds }
    }).sort({ date: 1 });

    /* ===== Daily Attendance (for heatmap) ===== */
    const dailyAttendance = allAttendance.map(a => ({
      date: a.date.toISOString().split("T")[0],
      status: a.status
    }));

    /* ===== Course-wise aggregation ===== */
    const attendanceStats = await Attendance.aggregate([
      {
        $match: {
          studentId,
          courseId: { $in: courseIds }
        }
      },
      {
        $group: {
          _id: "$courseId",
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const attendanceMap = {};
    attendanceStats.forEach(a => {
      attendanceMap[a._id.toString()] = a;
    });

    const courseAttendance = enrollments.map(e => {
      const stats = attendanceMap[e.courseId._id.toString()] || {
        total: 0,
        present: 0
      };

      return {
        _id: e.courseId._id,
        name: e.courseId.title.en,
        total: stats.total,
        present: stats.present,
        percent: stats.total
          ? Math.round((stats.present / stats.total) * 100)
          : 0
      };
    });

    /* ===== Calculate Streak ===== */
    let streak = 0;
    const reversed = [...dailyAttendance].reverse();

    for (let i = 0; i < reversed.length; i++) {
      if (reversed[i].status === "Present") {
        streak++;
      } else {
        break;
      }
    }

    res.status(200).json({
      dailyAttendance,
      courseAttendance,
      streak
    });

  } catch (error) {
    console.log("Error in getStudentAttendance:", error);
    next(error);
  }
};