import cloudinary from "../config/cloudinary.js";
const cloudinaryUpload = async (item, folder) => {
  try {
    if (!item) return null;

    const b64 = Buffer.from(item.buffer).toString("base64");
    const dataURI = `data:${item.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: "auto",
    });

    return result;
  } catch (error) {
    console.log("Error in uploading to cloudinary: ", error);
    throw error;
  }
};

export default cloudinaryUpload;
