import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    position: {
      type: String,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    refer_id: {
      type: String,
      default: null,
    },
    sponsor_id: {
      type: String,
    },
    isPackage: {
      type: Boolean,
      default: false,
    },
    isEquityInvest: {
      type: Boolean,
      default: false,
    },
    purchasePackes: [
      {
        packageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "BuyPackage",
        },
      },
    ],
    role: {
      type: String,
      enum: ["agent", "user"],
      default: "user",
    },
    left: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    right: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);
