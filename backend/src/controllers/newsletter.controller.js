import Newsletter from "../models/newsletter.model.js";
import sendNewsletterEmail from "../utils/sendNewsletterEmail.js";
import crypto from "crypto";

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next({
        status: 400,
        message: "Email is required",
      });
    }

    const exists = await Newsletter.findOne({ email });
    const token = crypto.randomBytes(32).toString("hex");

    if (exists) {
      if (exists.status === "active") {
        return next({
          status: 400,
          message: "Email already subscribed",
        });
      }

      exists.status = "active";
      exists.subscribedAt = new Date();
      exists.unsubscribeToken = token;
      await exists.save();

      return res.status(200).json({
        message: "Subscribed again successfully",
      });
    }

    const newsletter = await Newsletter.create({
      email,
      status: "active",
      unsubscribeToken: token,
      subscribedAt: new Date(),
    });

    res.status(201).json({
      message: "Subscribed successfully",
      newsletter,
    });
  } catch (error) {
    next(error);
  }
};

export const getNewsletter = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      Newsletter.find({ status: "active" })
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limit),

      Newsletter.countDocuments({ status: "active" }),
    ]);

    res.status(200).json({
      subscribers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.log("Error in getNewsletter:", error);
    next(error);
  }
};

export const removeNewsletter = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next({
        status: 400,
        message: "Id is required",
      });
    }

    const subscriber = await Newsletter.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { new: true },
    );

    if (!subscriber) {
      return next({
        status: 404,
        message: "Subscriber not found",
      });
    }

    res.status(200).json({
      message: "Subscriber removed successfully",
    });
  } catch (error) {
    console.log("Error in removing newsletter:", error);
    next(error);
  }
};

export const newsletterStats = async (req, res, next) => {
  try {
    const [total, active, inactive, unsubscribed] = await Promise.all([
      Newsletter.countDocuments(),
      Newsletter.countDocuments({ status: "active" }),
      Newsletter.countDocuments({ status: "inactive" }),
      Newsletter.countDocuments({ status: "unsubscribed" }),
    ]);

    res.status(200).json({
      total,
      active,
      inactive,
      unsubscribed,
    });
  } catch (error) {
    console.error("Newsletter stats error:", error);
    next(error);
  }
};

export const sendNewsletter = async (req, res, next) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return next({
        status: 400,
        message: "All fields are required",
      });
    }

    const subscribers = await Newsletter.find({ status: "active" });

    if (subscribers.length === 0) {
      return res.status(200).json({
        message: "No active subscribers found",
      });
    }

    await Promise.all(
      subscribers.map((subs) =>
        sendNewsletterEmail(
          subs.email,
          subject,
          message,
          subs.unsubscribeToken,
        ),
      ),
    );

    res.status(200).json({
      message: `Newsletter sent to ${subscribers.length} subscribers`,
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    next(error);
  }
};

export const unsubscribe = async (req, res) => {
  const { token } = req.query;

  const user = await Newsletter.findOne({ unsubscribeToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired link" });
  }

  user.status = "unsubscribed";
  user.unsubscribedAt = new Date();
  user.unsubscribeToken = crypto.randomBytes(32).toString("hex");
  await user.save();

  return res.redirect(`${process.env.FRONTEND_URL}/unsubscribe-success`);
};
