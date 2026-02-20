import express from "express";
import { applyJob, getAllJobs, getJobById } from "../controllers/job.controller.js";
import protectedRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, getAllJobs);
router.post("/apply", protectedRoute, applyJob);
router.get("/:id", protectedRoute, getJobById);


export default router;
