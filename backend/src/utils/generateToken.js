import jwt from "jsonwebtoken";
const generateToken = (user, req, res) => {
  try {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    req.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
    return token;
  } catch (error) {
    console.log("Error in generating token: ", error);
    throw error;
  }
};

export default generateToken;
