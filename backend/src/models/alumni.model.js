import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    batchYear: {
      type: String,
      required: true,
    },

    skills: [
      {
        type: String,
      },
    ],

    image: {
      url: String,
      publicId: String,
    },

    linkedin: {
      type: String,
    },

    packageLPA: {
      type: Number,
    },

    isPlaced: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Alumni = mongoose.model("Alumni", alumniSchema);
export default Alumni;