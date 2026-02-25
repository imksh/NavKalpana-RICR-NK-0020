import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import Module from "../models/module.model.js";
import mongoose from "mongoose";
import Lesson from "../models/lesson.model.js";
import Assignment from "../models/assignment.model.js";
import AssignmentSubmission from "../models/assignmentSubmission.model.js";
import User from "../models/user.model.js";

const getSubmissionConsistencyByCourse = async ({
  studentId,
  courseIds = [],
}) => {
  if (!studentId || !courseIds.length) return {};

  const assignments = await Assignment.find(
    { courseId: { $in: courseIds } },
    { _id: 1, courseId: 1 },
  );

  if (!assignments.length) return {};

  const assignmentIds = assignments.map((item) => item._id);
  const assignmentCourseMap = new Map(
    assignments.map((item) => [item._id.toString(), item.courseId.toString()]),
  );

  const totalsByCourse = new Map();

  assignments.forEach((item) => {
    const courseId = item.courseId.toString();
    totalsByCourse.set(courseId, (totalsByCourse.get(courseId) || 0) + 1);
  });

  const submissions = await AssignmentSubmission.find(
    {
      studentId,
      assignmentId: { $in: assignmentIds },
    },
    { assignmentId: 1, isLate: 1, status: 1 },
  );

  const onTimeByCourse = new Map();

  submissions.forEach((submission) => {
    const assignmentId = submission.assignmentId?.toString();
    const courseId = assignmentCourseMap.get(assignmentId);

    if (!courseId) return;

    const isOnTime =
      submission.isLate !== true && submission.status !== "Late Submitted";

    if (!isOnTime) return;

    if (!onTimeByCourse.has(courseId)) {
      onTimeByCourse.set(courseId, new Set());
    }

    onTimeByCourse.get(courseId).add(assignmentId);
  });

  const consistencyByCourse = {};

  totalsByCourse.forEach((totalAssignments, courseId) => {
    const onTimeCount = onTimeByCourse.get(courseId)?.size || 0;
    consistencyByCourse[courseId] =
      totalAssignments > 0
        ? Math.round((onTimeCount / totalAssignments) * 100)
        : 0;
  });

  return consistencyByCourse;
};

const getTotalLessonsByCourseIds = async (courseIds = []) => {
  if (!courseIds.length) return {};

  const modules = await Module.find(
    { courseId: { $in: courseIds } },
    { _id: 1, courseId: 1 },
  );

  if (!modules.length) {
    return Object.fromEntries(courseIds.map((id) => [id.toString(), 0]));
  }

  const moduleIds = modules.map((item) => item._id);

  const lessonsByModule = await Lesson.aggregate([
    { $match: { moduleId: { $in: moduleIds } } },
    { $group: { _id: "$moduleId", count: { $sum: 1 } } },
  ]);

  const lessonCountByModule = new Map(
    lessonsByModule.map((item) => [item._id.toString(), item.count]),
  );

  const totalsByCourse = {};

  courseIds.forEach((id) => {
    totalsByCourse[id.toString()] = 0;
  });

  modules.forEach((module) => {
    const courseId = module.courseId.toString();
    totalsByCourse[courseId] =
      (totalsByCourse[courseId] || 0) +
      (lessonCountByModule.get(module._id.toString()) || 0);
  });

  return totalsByCourse;
};

export const getStudentCourse = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ studentId }).populate({
      path: "courseId",
      populate: {
        path: "instructor",
        select: "name email role bio phone photo skillsAcquired",
      },
    });

    const consistencyByCourse = await getSubmissionConsistencyByCourse({
      studentId,
      courseIds: enrollments.map((item) => item.courseId?._id).filter(Boolean),
    });

    const totalLessonsByCourse = await getTotalLessonsByCourseIds(
      enrollments.map((item) => item.courseId?._id).filter(Boolean),
    );

    const enrollmentUpdates = [];
    const mergedSkills = new Set(req.user.skillsAcquired || []);

    const coursesWithStats = enrollments.map((e) => {
      const totalLessons =
        totalLessonsByCourse[e.courseId._id.toString()] ||
        e.courseId.totalLessons ||
        0;

      const progress = Math.round(
        totalLessons > 0 ? (e.completedLessons.length / totalLessons) * 100 : 0,
      );

      if ((e.progressPercent || 0) !== progress) {
        e.progressPercent = progress;
        enrollmentUpdates.push(e.save());
      }

      if (progress === 100) {
        (e.courseId?.skills || []).forEach((skill) => mergedSkills.add(skill));
      }

      return {
        ...e.courseId._doc,
        progress,
        attendancePercent: e.attendancePercent || 0,
        submissionConsistencyPercent:
          consistencyByCourse[e.courseId._id.toString()] || 0,
      };
    });

    if (enrollmentUpdates.length) {
      await Promise.all(enrollmentUpdates);
    }

    if (mergedSkills.size !== (req.user.skillsAcquired || []).length) {
      await User.findByIdAndUpdate(studentId, {
        skillsAcquired: Array.from(mergedSkills),
      });
    }

    res.status(200).json(coursesWithStats);
  } catch (error) {
    console.log("Error in getting student course:", error);
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const studentId = req.user?._id; // must be protected route

    const course = await Course.findOne({ slug }).populate(
      "instructor",
      "name email role bio phone photo skillsAcquired",
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let progress = 0;
    let attendancePercent = 0;
    let submissionConsistencyPercent = 0;

    if (studentId) {
      const enrollment = await Enrollment.findOne({
        studentId,
        courseId: course._id,
      });

      if (enrollment) {
        const totalLessonsByCourse = await getTotalLessonsByCourseIds([
          course._id,
        ]);

        const totalLessons =
          totalLessonsByCourse[course._id.toString()] ||
          course.totalLessons ||
          0;

        progress = Math.round(
          totalLessons > 0
            ? ((enrollment.completedLessons?.length || 0) / totalLessons) * 100
            : 0,
        );

        attendancePercent = enrollment.attendancePercent || 0;

        if ((enrollment.progressPercent || 0) !== progress) {
          enrollment.progressPercent = progress;
          await enrollment.save();
        }

        if (progress === 100) {
          const currentUser = await User.findById(studentId);
          const mergedSkills = new Set(currentUser?.skillsAcquired || []);
          (course.skills || []).forEach((skill) => mergedSkills.add(skill));

          if (
            mergedSkills.size !== (currentUser?.skillsAcquired || []).length
          ) {
            await User.findByIdAndUpdate(studentId, {
              skillsAcquired: Array.from(mergedSkills),
            });
          }
        }
      }

      const consistencyByCourse = await getSubmissionConsistencyByCourse({
        studentId,
        courseIds: [course._id],
      });

      submissionConsistencyPercent =
        consistencyByCourse[course._id.toString()] || 0;
    }

    res.status(200).json({
      ...course._doc,
      progress,
      attendancePercent,
      submissionConsistencyPercent,
    });
  } catch (error) {
    console.log("Error in getCourse:", error);
    next(error);
  }
};

export const getCourseModules = async (req, res, next) => {
  try {
    const { id } = req.params;

    const modules = await Module.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "_id",
          foreignField: "moduleId",
          as: "lessons",
        },
      },
      {
        $sort: { order: 1 },
      },
      {
        $addFields: {
          lessonsCount: { $size: "$lessons" },
        },
      },
    ]);

    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: id,
    });

    const completedLessons = enrollment?.completedLessons || [];

    const modulesWithStatus = modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        isCompleted: completedLessons.includes(lesson._id.toString()),
      })),
    }));

    res.status(200).json(modulesWithStatus);
  } catch (error) {
    console.log("Error in getCourseModules:", error);
    next(error);
  }
};

export const getLessonBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const lesson = await Lesson.findOne({ slug });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const module = await Module.findById(lesson.moduleId);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: module.courseId, // Assuming moduleId is same as courseId for simplicity
    });

    const isCompleted = enrollment?.completedLessons?.includes(lesson._id);

    lesson._doc.isCompleted = isCompleted;

    res.status(200).json(lesson);
  } catch (error) {
    next(error);
  }
};

export const getModuleLessons = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lessons = await Lesson.find({ moduleId: id });
    const module = await Module.findById(id);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: module.courseId, // Assuming all lessons belong to the same course
    });

    const completedLessons = enrollment?.completedLessons || [];

    const lessonsWithStatus = lessons.map((lesson) => ({
      ...lesson._doc,
      isCompleted: completedLessons.includes(lesson._id.toString()),
    }));

    res.status(200).json(lessonsWithStatus);
  } catch (error) {
    console.log("Error in getModuleLessons: ", error);
    next(error);
  }
};

export const markLessonCompleted = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const user = req.user;
    const studentId = req.user._id;

    /* ===== Find Lesson ===== */
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    /* ===== Find Module to Get Course ===== */
    const module = await Module.findById(lesson.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const courseId = module.courseId;

    /* ===== Find Enrollment ===== */
    const enrollment = await Enrollment.findOne({
      studentId,
      courseId,
    }).populate("courseId", "skills");

    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled in course" });
    }

    /* ===== Prevent Duplicate Completion ===== */
    const alreadyCompleted = enrollment.completedLessons.includes(lessonId);

    if (alreadyCompleted) {
      return res.status(400).json({
        message: "Lesson already marked completed",
      });
    }

    /* ===== Add Lesson to Completed ===== */
    enrollment.completedLessons.push(lessonId);

    /* ===== Calculate Progress ===== */
    const course = await Course.findById(courseId);

    const totalLessonsByCourse = await getTotalLessonsByCourseIds([courseId]);
    const totalLessons =
      totalLessonsByCourse[courseId.toString()] || course.totalLessons || 0;

    const progress = Math.round(
      totalLessons > 0
        ? (enrollment.completedLessons.length / totalLessons) * 100
        : 0,
    );

    enrollment.progressPercent = progress;
    enrollment.lastAccessed = new Date();

    await enrollment.save();

    if (enrollment.progressPercent === 100) {
      const mergedSkills = new Set(user.skillsAcquired || []);
      (enrollment.courseId.skills || []).forEach((skill) =>
        mergedSkills.add(skill),
      );
      user.skillsAcquired = Array.from(mergedSkills);
      await user.save();
    }
    res.status(200).json({
      message: "Lesson marked completed",
      progressPercent: enrollment.progressPercent,
      lesson,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};
