// controllers/push.controller.js
import PushSubscription from "../models/pushSubscription.model.js";

export const savePushSubscription = async (req, res) => {
  const { endpoint, keys } = req.body;

  if (!endpoint || !keys) {
    return res.status(400).json({ message: "Invalid subscription" });
  }

  await PushSubscription.findOneAndUpdate(
    { endpoint },
    {
      endpoint,
      keys,
      user: req.user._id,
      role: req.user.role,
    },
    { upsert: true, new: true },
  );

  res.json({ message: "Push subscription saved" });
};

export const webPushUnsubscribe = async (req, res) => {
  const { endpoint } = req.body;

  if (!endpoint) {
    return res.status(400).json({ message: "Endpoint required" });
  }

  await PushSubscription.deleteOne({
    endpoint,
    user: req.user._id,
  });

  res.json({ message: "Unsubscribed successfully" });
};

export const pushTest = async (req, res, next) => {
  try {
    await sendPushNotification({
      title: "Push test",
      body: `Push is working`,
      url: "/student",
    });
    res.status(200).json({ message: "Push is working" });
  } catch (error) {
    console.log("Error in push test", error);
    next(error);
  }
};
