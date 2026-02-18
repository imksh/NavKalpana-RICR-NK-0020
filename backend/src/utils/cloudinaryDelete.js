import cloudinary from "../config/cloudinary.js";

const cloudinaryDelete = async (publicId, type) => {
  try {
    if (!publicId) return false;

    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });

    return res?.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete file from Cloudinary");
  }
};

export default cloudinaryDelete;
