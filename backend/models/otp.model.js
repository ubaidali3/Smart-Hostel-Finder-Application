import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["student", "warden"],
      required: true,
    },

    codeHash: {
      type: String,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    expireAt: {
      type: Date,
      required: true,
    },

    lastSentAt: {
      type: Date,
      required: true,
    },

    // Prevent concurrent resend requests.
    sendLockUntil: {
      type: Date,
      default: null,
    },

    // Prevent concurrent OTP verification.
    verifyingUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

otpSchema.index(
  { expireAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.models.Otp ||
  mongoose.model("Otp", otpSchema);