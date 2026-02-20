import Assignment from "../models/assignment.model.js";
import AssignmentSubmission from "../models/assignmentSubmission.model.js";
import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";

export const getStudentAssignments = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    // 1️⃣ Get enrolled courses
    const enrollments = await Enrollment.find({ studentId });
    const courseIds = enrollments.map((e) => e.courseId);

    // 2️⃣ Get assignments of those courses
    const assignments = await Assignment.find({
      courseId: { $in: courseIds },
      isActive: true,
    }).populate("courseId", "title");

    // 3️⃣ Get submissions of student
    const submissions = await AssignmentSubmission.find({
      studentId,
    });

    // Map submissions for quick lookup
    const submissionMap = {};
    submissions.forEach((sub) => {
      submissionMap[sub.assignmentId.toString()] = sub;
    });

    // 4️⃣ Merge assignment + submission
    const result = assignments.map((assignment) => {
      const submission = submissionMap[assignment._id.toString()];

      let status = "Pending";
      let marks = null;

      if (submission) {
        status = submission.status;
        marks = submission.marks ?? null;
      }

      return {
        _id: assignment._id,
        title: assignment.title,
        course: assignment.courseId?.title?.en,
        deadline: assignment.deadline,
        maxMarks: assignment.maxMarks,
        status,
        marks,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in getStudentAssignments:", error);
    next(error);
  }
};


export const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    // 1️⃣ Get assignment
    const assignment = await Assignment.findById(id)
      .populate("courseId", "title")
      .populate("moduleId", "title");

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    // 2️⃣ Get student submission (if any)
    const submission = await AssignmentSubmission.findOne({
      assignmentId: id,
      studentId,
    });

    let status = "Pending";
    let marks = null;
    let feedback = null;

    if (submission) {
      status = submission.status;
      marks = submission.marks ?? null;
      feedback = submission.feedback ?? null;
    }

    res.status(200).json({
      _id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline,
      maxMarks: assignment.maxMarks,
      course: assignment.courseId?.title?.en,
      module: assignment.moduleId?.title?.en,
      status,
      marks,
      feedback,
      submittedAt: submission?.submittedAt || null,
    });

  } catch (error) {
    console.log("Error in getAssignmentById:", error);
    next(error);
  }
};