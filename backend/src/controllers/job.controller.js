import Job from "../models/job.model.js";
import JobApplication from "../models/jobApplication.model.js";

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

export const applyJob = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { jobId } = req.body;

    const alreadyApplied = await JobApplication.findOne({
      jobId,
      studentId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already applied for this job",
      });
    }

    const application = await JobApplication.create({
      jobId,
      studentId,
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};
