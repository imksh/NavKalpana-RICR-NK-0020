import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import Module from "../models/module.model.js";
import mongoose from "mongoose";
import Lesson from "../models/lesson.model.js";

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

    const coursesWithStats = enrollments.map((e) => {
      const totalLessons = e.courseId.totalLessons || 1;

      const progress = Math.round(
        (e.completedLessons.length / totalLessons) * 100,
      );

      return {
        ...e.courseId._doc,
        progress,
        attendancePercent: e.attendancePercent || 0,
      };
    });

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

    if (studentId) {
      const enrollment = await Enrollment.findOne({
        studentId,
        courseId: course._id,
      });

      if (enrollment) {
        const totalLessons = course.totalLessons || 1;

        progress = Math.round(
          ((enrollment.completedLessons?.length || 0) / totalLessons) * 100,
        );

        attendancePercent = enrollment.attendancePercent || 0;
      }
    }

    res.status(200).json({
      ...course._doc,
      progress,
      attendancePercent,
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

    console.log(modules);

    res.status(200).json(modules);
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

    res.status(200).json(lesson);
  } catch (error) {
    next(error);
  }
};

export const getModuleLessons = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lessons = await Lesson.find({ moduleId: id });
    res.status(200).json(lessons);
  } catch (error) {
    console.log("Error in getModuleLessons: ", error);
    next(error);
  }
};
