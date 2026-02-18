import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    service: {
      type: String,
      default: "General Inquiry",
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "read", "replied", "deleted"],
      default: "new",
    },

    repliedAt: {
      type: Date,
    },

    reply: {
      type: String,
    },

    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
