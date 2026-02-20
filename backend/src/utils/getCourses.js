import Enrollment from "../models/enrollment.model.js";

const getCourses = async (user) => {
  try {
    const courses = Enrollment.find({ studentId: user._id });
  } catch (error) {
    throw error;
  }
};
