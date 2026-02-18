import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const protectedRoute = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next({
        status: 401,
        message: "Unauthorized: token missing",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next({
        status: 404,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectedRoute: ", error);
    return next({
      status: 401,
      message: "Invalid or expired token",
    });
  }
};

export default protectedRoute;
