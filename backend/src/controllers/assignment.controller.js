import Assignment from "../models/assignment.model.js";
import AssignmentSubmission from "../models/assignmentSubmission.model.js";
import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import cloudinary from "../config/cloudinary.js";
import { updateLearningStreak } from "../utils/updateLearningStreak.js";
import LearningActivity from "../models/learningActivity.model.js";

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
        isLate: submission?.isLate === true,
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
    let content = null;
    let file = null;
    let link = null;

    if (submission) {
      status = submission.status;
      marks = submission.marks ?? null;
      feedback = submission.feedback ?? null;
      content = submission.content ?? null;
      file = submission.file ?? null;
      link = submission.link ?? null;
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
      content,
      file,
      link,
      submittedAt: submission?.submittedAt || null,
    });
  } catch (error) {
    console.log("Error in getAssignmentById:", error);
    next(error);
  }
};

export const submitAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;
    const { content, link } = req.body;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    /* ===== Prevent duplicate ===== */
    const existing = await AssignmentSubmission.findOne({
      assignmentId: id,
      studentId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already submitted",
      });
    }

    /* ===== Validate at least one ===== */
    if (!content && !link && !req.file) {
      return res.status(400).json({
        message: "Submit text, link or file",
      });
    }

    const isLate = new Date() > new Date(assignment.deadline);
    const status = isLate ? "Late Submitted" : "Submitted";

    let submissionData = {
      assignmentId: id,
      studentId,
      content: content || null,
      link: link || null,
      isLate,
      status,
    };

    /* ===== FILE UPLOAD ===== */
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "assignments",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });

      submissionData.file = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const submission = await AssignmentSubmission.create(submissionData);

    //Streak Address
    /* ===== CREATE ACTIVITY ===== */
    await LearningActivity.create({
      studentId,
      courseId: assignment.courseId,
      actionType: "assignment_submitted",
      referenceId: assignment._id,
    });

    /* ===== UPDATE STREAK ===== */
    await updateLearningStreak(studentId);

    res.status(201).json({
      message: "Submitted successfully",
      status: submission.status,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
