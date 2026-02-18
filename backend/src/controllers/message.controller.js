import Message from "../models/message.model.js";
import sendContactReplyEmail from "../utils/sendContactReplyEmail.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { name, phone, service, email, message } = req.body;

    if (!name || !phone || !service || !email || !message) {
      return next({
        status: 404,
        message: "All fields are required",
      });
    }

    const newMessage = await Message.create({
      name,
      phone,
      service,
      email,
      message,
    });

    res.status(200).json(newMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ status: { $ne: "deleted" } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Message.countDocuments(),
    ]);

    console.log(messages);

    res.status(200).json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next({
        status: 400,
        message: "Id is required",
      });
    }

    const message = await Message.findByIdAndUpdate(
      id,
      { status: "deleted" },
      { new: true },
    );

    if (!message) {
      return next({
        status: 404,
        message: "Message not found",
      });
    }

    res.status(200).json({
      message: "Message removed",
    });
  } catch (error) {
    console.log("Error in deleting message:", error);
    next(error);
  }
};

export const readMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next({
        status: 400,
        message: "Id is required",
      });
    }

    const message = await Message.findOneAndUpdate(
      { _id: id, status: { $ne: "deleted" } },
      { status: "read" },
      { new: true },
    );

    if (!message) {
      return next({
        status: 404,
        message: "Message not found or already deleted",
      });
    }

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in reading message:", error);
    next(error);
  }
};

export const replyMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!id) {
      return next({
        status: 400,
        message: "Id is required",
      });
    }

    if (!reply) {
      return next({
        status: 400,
        message: "Reply message is required",
      });
    }

    const message = await Message.findOneAndUpdate(
      {
        _id: id,
        status: { $nin: ["deleted", "replied"] },
      },
      {
        reply,
        repliedAt: new Date(),
        status: "replied",
      },
      { new: true },
    );

    if (!message) {
      return next({
        status: 404,
        message: "Message not found or already replied",
      });
    }

    await sendContactReplyEmail(message.email, message.name, reply);

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in replying message:", error);
    next(error);
  }
};

export const messageStats = async (req, res, next) => {
  try {
    const [total, newMessage, read, replied, deleted] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ status: "new" }),
      Message.countDocuments({ status: "read" }),
      Message.countDocuments({ status: "replied" }),
      Message.countDocuments({ status: "deleted" }),
    ]);

    res.status(200).json({
      total,
      new: newMessage,
      read,
      replied,
      deleted,
    });
  } catch (error) {
    console.error("Message stats error:", error);
    next(error);
  }
};
