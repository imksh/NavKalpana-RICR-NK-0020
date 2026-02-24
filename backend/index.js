//dotenv
import "./src/config/env.js";

//package import
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cloudinary from "./src/config/cloudinary.js";
import connectDB from "./src/config/db.js";
import authRouter from "./src/routers/auth.route.js";
import publicRouter from "./src/routers/public.route.js";
import adminRouter from "./src/routers/admin.route.js";
import studentRouter from "./src/routers/student.route.js";
import instructorRouter from "./src/routers/instructor.route.js";
import courseRouter from "./src/routers/course.route.js";
import jobRouter from "./src/routers/job.route.js";
import aiRouter from "./src/routers/ai.route.js";

const app = express();

//middleware

app.use(
  cors({
    origin: ["http://localhost:5173", "https://imksh-gradify.netlify.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(morgan("dev"));

//routers

app.use("/api/public", publicRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/student", studentRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/course", courseRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/ai", aiRouter);

//home route
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server is running" });
});

//not found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

//error middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

//port
const port = process.env.PORT || 4500;

app.listen(port, async () => {
  console.log("Server is started at: ", port);
  connectDB();
  // try {
  //   const res = await cloudinary.api.ping();
  //   console.log("Cloudinary api is working ", res);
  // } catch (error) {
  //   console.error("Error in connecting cloudinary api", error);
  // }
});
