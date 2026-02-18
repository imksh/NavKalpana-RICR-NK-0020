import jwt from "jsonwebtoken";

const genOtpToken = (user, res) => {
  try {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.cookie("otpToken", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
  } catch (error) {
    console.log("Error in generating token: ", error);
    throw error;
  }
};

export default genOtpToken;
