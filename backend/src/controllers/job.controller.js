import Job from "../models/job.model.js";
import JobApplication from "../models/jobApplication.model.js";
import cloudinary from "../config/cloudinary.js";

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    const appliedJobs = await JobApplication.find({
      studentId: req.user._id,
    }).select("jobId");
    const appliedJobIds = appliedJobs.map((app) => app.jobId.toString());

    const jobsWithStatus = jobs.map((job) => ({
      ...job.toObject(),
      hasApplied: appliedJobIds.includes(job._id.toString()),
    }));
    res.status(200).json(jobsWithStatus);
  } catch (error) {
    next(error);
  }
};

export const applyJob = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { coverLetter, jobId } = req.body;

    /* ===== Check duplicate ===== */
    const alreadyApplied = await JobApplication.findOne({
      jobId,
      studentId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already applied for this job",
      });
    }

    /* ===== Validate Resume ===== */
    if (!req.file) {
      return res.status(400).json({
        message: "Resume (PDF) is required",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed",
      });
    }

    /* ===== Upload to Cloudinary ===== */
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw", // 🔥 important for pdf
            folder: "resumes",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });

    const uploadResult = await uploadToCloudinary();

    /* ===== Save Application ===== */
    const application = await JobApplication.create({
      jobId,
      studentId,
      coverLetter,
      resumeUrl: uploadResult.secure_url,
      resumePublicId: uploadResult.public_id,
    });

    return res.status(201).json(application);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    const application = await JobApplication.findOne({
      jobId: req.params.id,
      studentId: req.user._id,
    });

    const jobWithStatus = {
      ...job.toObject(),
      hasApplied: !!application,
      resume: application?.resumeUrl,
      coverLetter: application?.coverLetter,
      applicationStatus: application?.status || "Not Applied",
    };

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(jobWithStatus);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const applications = await JobApplication.find({
      studentId,
    })
      .populate("jobId")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => ({
      _id: app._id,
      jobId: app.jobId?._id,
      title: app.jobId?.title,
      company: app.jobId?.company,
      location: app.jobId?.location,
      type: app.jobId?.type,
      status: app.status || "Pending",
      appliedAt: app.createdAt,
      resumeUrl: app.resumeUrl,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};
