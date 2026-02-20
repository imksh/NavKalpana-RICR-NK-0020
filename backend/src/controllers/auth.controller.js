import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import genOtpToken from "../utils/genOtpToken.js";
import sendOtpEmail from "../utils/sendOtpEmail.js";

/* ============================= */
/*            SIGNUP             */
/* ============================= */
export const signup = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return next({ status: 400, message: "All fields are required." });
    }

    const lowerEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: lowerEmail });
    
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const photoURL = `https://placehold.co/600x400?text=${name
      .charAt(0)
      .toUpperCase()}`;

    const newUser = await User.create({
      name,
      email: lowerEmail,
      phone,
      password: hashedPassword,
      role: "student", // prevent role injection
      photo: { url: photoURL },
      isVerified: false,
    });
    generateToken(newUser, res);
    const { password: _, ...safeUser } = newUser._doc;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================= */
/*             LOGIN             */
/* ============================= */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next({ status: 400, message: "All fields are required." });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await generateToken(user, res);

    const { password: _, ...safeUser } = user._doc;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================= */
/*             LOGOUT            */
/* ============================= */
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

/* ============================= */
/*           CHECK AUTH          */
/* ============================= */
export const checkAuth = async (req, res, next) => {
  try {
    const { password, ...safeUser } = req.user._doc;
    res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
};

/* ============================= */
/*            GENERATE OTP       */
/* ============================= */
export const genOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next({ status: 400, message: "Email is required." });
    }

    const lowerEmail = email.toLowerCase();

    const user = await User.findOne({ email: lowerEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingOtp = await Otp.findOne({ email: lowerEmail });
    if (existingOtp) {
      await existingOtp.deleteOne();
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.create({
      email: lowerEmail,
      otp: hashedOtp,
    });

    await sendOtpEmail(lowerEmail, otp);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};

/* ============================= */
/*           VERIFY OTP          */
/* ============================= */
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next({ status: 400, message: "All fields are required." });
    }

    const lowerEmail = email.toLowerCase();

    const user = await User.findOne({ email: lowerEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingOtp = await Otp.findOne({ email: lowerEmail });
    if (!existingOtp) {
      return next({ status: 400, message: "OTP invalid or expired" });
    }

    const isMatched = await bcrypt.compare(otp, existingOtp.otp);
    if (!isMatched) {
      return next({ status: 400, message: "OTP invalid or expired" });
    }

    user.isVerified = true;
    await user.save();

    await existingOtp.deleteOne();

    await genOtpToken(user, res);

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    next(error);
  }
};

/* ============================= */
/*         RESET PASSWORD        */
/* ============================= */
export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return next({ status: 400, message: "New password required." });
    }

    const user = req.user;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
