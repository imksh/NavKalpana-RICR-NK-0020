import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "unsubscribed", "inactive"],
      default: "active",
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },

    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

export default Newsletter;
