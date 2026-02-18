import Visitor from "../models/visiter.model.js";
import getIP from "../utils/getIP.js";

export const trackVisitor = async (req, res, next) => {
  try {
    // get real IP
    const ip = getIP(req);

    // today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // one visitor per IP per day
    await Visitor.findOneAndUpdate(
      { ip, date: today },
      { ip, date: today },
      { upsert: true, new: true },
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Visitor tracking error:", error);
    next(error);
  }
};

