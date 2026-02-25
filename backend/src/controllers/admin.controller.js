import webpush from "../config/webPush.js";
import PushSubscription from "../models/pushSubscription.model.js";
import User from "../models/user.model.js";

export const sendTestNotificationToStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" }).select("_id");
    const studentIds = students.map((student) => student._id);

    if (!studentIds.length) {
      return res
        .status(200)
        .json({ message: "No students found", sent: 0, failed: 0 });
    }

    const subscriptions = await PushSubscription.find({
      user: { $in: studentIds },
    });

    if (!subscriptions.length) {
      return res.status(200).json({
        message: "No student push subscriptions found",
        sent: 0,
        failed: 0,
      });
    }

    const payload = JSON.stringify({
      title: "Test Notification",
      body: "This is a demo notification from admin.",
      url: "/student/notifications",
      tag: "admin-test-notification",
    });

    let sent = 0;
    let failed = 0;

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys,
            },
            payload,
          );
          sent += 1;
        } catch (error) {
          failed += 1;
          if (error?.statusCode === 404 || error?.statusCode === 410) {
            await PushSubscription.deleteOne({ _id: sub._id });
          }
        }
      }),
    );

    return res.status(200).json({
      message: `Test notification sent to ${sent} device(s)`,
      sent,
      failed,
    });
  } catch (error) {
    return next(error);
  }
};
