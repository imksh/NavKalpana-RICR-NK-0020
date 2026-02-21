import Alumni from "../models/alumni.model.js";

/* ================= GET ALL ================= */
export const getAllAlumni = async (req, res, next) => {
  try {
    const alumni = await Alumni.find().sort({ createdAt: -1 });

    res.status(200).json(alumni);
  } catch (error) {
    next(error);
  }
};

/* ================= GET STATS ================= */
export const getAlumniStats = async (req, res, next) => {
  try {
    const totalAlumni = await Alumni.countDocuments();
    const placedStudents = await Alumni.countDocuments({ isPlaced: true });

    const companies = await Alumni.distinct("company");

    const avgPackageAgg = await Alumni.aggregate([
      { $match: { packageLPA: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: "$packageLPA" } } },
    ]);

    const avgPackage =
      avgPackageAgg.length > 0
        ? avgPackageAgg[0].avg.toFixed(1)
        : 0;

    res.status(200).json({
      totalAlumni,
      placedStudents,
      topCompanies: companies.length,
      avgPackage: `₹${avgPackage} LPA`,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= CREATE (Admin) ================= */
export const createAlumni = async (req, res, next) => {
  try {
    const alumni = await Alumni.create(req.body);
    res.status(201).json(alumni);
  } catch (error) {
    next(error);
  }
};