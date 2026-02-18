import mongoose from "mongoose";

const visitorSchema = mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },

    date: {
      type: String, // "2026-01-29"
      required: true,
    },
  },
  { timestamps: true },
);

visitorSchema.index({ ip: 1, date: 1 }, { unique: true });

export default mongoose.model("Visitor", visitorSchema);
