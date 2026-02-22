import Enrollment from "../models/enrollment.model.js";
import Attendance from "../models/attendance.model.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

export const getStudentAttendance = async (req, res, next) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.user._id);

    /* ===== Get enrolled courses ===== */
    const enrollments = await Enrollment.find({ studentId }).populate(
      "courseId",
      "title"
    );

    const courseIds = enrollments.map((e) => e.courseId._id);

    /* ===== Get all attendance records ===== */
    const allAttendance = await Attendance.find({
      studentId,
      courseId: { $in: courseIds },
    })
      .populate("courseId", "title")
      .sort({ date: 1 });

    /* ===== Daily Attendance (Now includes courseId + name) ===== */
    const dailyAttendance = allAttendance.map((a) => ({
      date: a.date.toISOString().split("T")[0],
      status: a.status,
      courseId: a.courseId._id,
      courseName: a.courseId.title.en,
    }));

    /* ===== Course-wise aggregation ===== */
    const attendanceStats = await Attendance.aggregate([
      {
        $match: {
          studentId,
          courseId: { $in: courseIds },
        },
      },
      {
        $group: {
          _id: "$courseId",
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const attendanceMap = {};
    attendanceStats.forEach((a) => {
      attendanceMap[a._id.toString()] = a;
    });

    const courseAttendance = enrollments.map((e) => {
      const stats = attendanceMap[e.courseId._id.toString()] || {
        total: 0,
        present: 0,
      };

      return {
        _id: e.courseId._id,
        name: e.courseId.title.en,
        total: stats.total,
        present: stats.present,
        percent: stats.total
          ? Math.round((stats.present / stats.total) * 100)
          : 0,
      };
    });

    /* ===== Calculate Streak (global) ===== */
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
      dailyAttendance,   // now usable for grouping
      courseAttendance,  // summary cards
      streak,
    });
  } catch (error) {
    console.log("Error in getStudentAttendance:", error);
    next(error);
  }
};

export const downloadAttendanceReport = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { course } = req.query;

    const student = await User.findById(studentId);

    const filter = { studentId };
    if (course) filter.courseId = course;

    const records = await Attendance.find(filter)
      .populate("courseId")
      .sort({ date: 1 });

    const total = records.length;
    const present = records.filter((r) => r.status === "Present").length;
    const percent = total > 0 ? Math.round((present / total) * 100) : 0;

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=gradify-attendance-report.pdf",
    );

    doc.pipe(res);

    /* ================= LAYOUT CONSTANTS ================= */

    const margin = 50;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const contentWidth = pageWidth - margin * 2;
    const leftX = margin;
    const rightX = pageWidth - margin;

    /* ================= HEADER ================= */

    doc.rect(0, 0, pageWidth, 110).fill("#4f46e5");

    doc.fillColor("#ffffff").fontSize(28).text("Gradify", leftX, 40);

    doc.fontSize(16).text("Student Attendance Report", leftX, 75);

    doc.fontSize(16).text(`Attendance: ${percent}%`, rightX - 180, 75, {
      width: 180,
      align: "right",
    });

    doc.moveDown(4);

    /* ================= STUDENT INFO ================= */

    doc.fillColor("#111827");
    doc.fontSize(18).text("Student Information", leftX, doc.y, {
      underline: true,
    });

    doc.moveDown(1);

    const infoY = doc.y;
    const leftColX = leftX;
    const rightColX = pageWidth / 2 + 10;

    doc.fontSize(12);

    // LEFT COLUMN
    doc.text(`Name: ${student.name}`, leftColX, infoY);
    doc.text(`Email: ${student.email}`, leftColX);
    doc.text(`Generated On: ${new Date().toDateString()}`, leftColX);

    if (course) {
      const courseData = await Course.findById(course);
      if (courseData) {
        doc.text(`Course: ${courseData.title.en}`, leftColX);
      }
    }

    // RIGHT COLUMN
    doc.text(`Total Classes: ${total}`, rightColX, infoY);
    doc.text(`Present: ${present}`, rightColX);
    doc.text(`Attendance %: ${percent}%`, rightColX);

    doc.moveDown(3);

    /* ================= TABLE HEADER ================= */

    doc.fillColor("#2563eb").rect(leftX, doc.y, contentWidth, 25).fill();

    doc.fillColor("#ffffff").fontSize(12);

    doc.text("Date", leftX + 10, doc.y + 7);
    doc.text("Course", leftX + 150, doc.y + 7);
    doc.text("Status", rightX - 80, doc.y + 7);

    doc.moveDown(2);

    /* ================= TABLE ROWS ================= */

    records.forEach((record, index) => {
      if (doc.y > pageHeight - 80) {
        doc.addPage();
      }

      if (index % 2 === 0) {
        doc.fillColor("#f9fafb").rect(leftX, doc.y, contentWidth, 25).fill();
      }

      doc.fillColor("#111827");

      doc.text(record.date.toDateString(), leftX + 10, doc.y + 7);

      doc.text(record.courseId?.title?.en || "N/A", leftX + 150, doc.y + 7, {
        width: 250,
      });

      doc
        .fillColor(record.status === "Present" ? "#22c55e" : "#ef4444")
        .text(record.status, rightX - 80, doc.y + 7);

      doc.moveDown(2);
    });

    /* ================= FOOTER ================= */

    doc.moveDown(2);
    doc
      .fillColor("#9ca3af")
      .fontSize(10)
      .text(
        "© 2026 Gradify — Empowering Learning Through Technology",
        leftX,
        doc.y,
        { width: contentWidth, align: "center" },
      );

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating report" });
  }
};
