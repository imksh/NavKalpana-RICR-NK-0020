import express from "express";
import {
  applyJob,
  getAllJobs,
  getJobById,
  getMyApplications,
} from "../controllers/job.controller.js";
import protectedRoute from "../middlewares/auth.middleware.js";
import cloudinaryUpload from "../middlewares/cloudinaryUpload.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, getAllJobs);
router.post(
  "/:id/apply",
  protectedRoute,
  cloudinaryUpload.single("resume"),
  applyJob,
);
router.get("/:id", protectedRoute, getJobById);

router.get("/jobs/my-applications", protectedRoute, getMyApplications);


export default router;
