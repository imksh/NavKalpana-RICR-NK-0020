import Session from "../models/session.model.js";

export const bookSession = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { instructorId, courseId, topic, notes, date, time } = req.body;
    console.log({ instructorId, courseId, topic, notes, date, time });

    if (!topic || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const session = await Session.create({
      studentId,
      instructorId: instructorId || null,
      courseId: courseId || null,
      topic,
      notes,
      date,
      time,
    });

    res.status(201).json({
      message: "Session booked successfully",
      session,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const getStudentSessions = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const sessions = await Session.find({ studentId })
      .populate("instructorId", "name photo")
      .populate("courseId", "title")
      .sort({ date: 1 });

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

export const getTutorSessions = async (req, res, next) => {
  try {
    const instructorId = req.user._id;

    const sessions = await Session.find({ instructorId })
      .populate("studentId", "name photo")
      .populate("courseId", "title")
      .sort({ date: 1 });

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

export const updateSessionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["Approved", "Rejected", "Completed", "Cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const session = await Session.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({
      message: "Session updated",
      session,
    });
  } catch (error) {
    next(error);
  }
};
