import Doubt from "../models/doubt.model.js";

export const createDoubt = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { subject, doubt, instructorId, courseId } = req.body;

    if (!subject || !doubt) {
      return res.status(400).json({
        message: "Subject and doubt message are required",
      });
    }

    const newDoubt = await Doubt.create({
      studentId,
      instructorId: instructorId || null,
      courseId: courseId || null,
      subject,
      message: doubt,
    });

    res.status(201).json({
      message: "Doubt submitted successfully",
      doubt: newDoubt,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentDoubts = async (req, res, next) => {
  try {
    const doubts = await Doubt.find({
      studentId: req.user._id,
    })
      .populate("instructorId", "name photo")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(doubts);
  } catch (error) {
    next(error);
  }
};


export const getInstructorDoubts = async (req, res, next) => {
  try {
    const doubts = await Doubt.find({
      instructorId: req.user._id,
      status: "Pending",
    })
      .populate("studentId", "name email photo")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(doubts);
  } catch (error) {
    next(error);
  }
};


export const replyToDoubt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const doubt = await Doubt.findById(id);

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    doubt.reply = reply;
    doubt.status = "Answered";
    doubt.repliedAt = new Date();

    await doubt.save();

    res.status(200).json({
      message: "Reply submitted",
      doubt,
    });
  } catch (error) {
    next(error);
  }
};