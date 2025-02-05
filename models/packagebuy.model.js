import mongoose from "mongoose";

const buyPackageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    screenshot: [],
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type:String,
      default: "pending",
      enum: ["pending", "completed", "rejected"],
    },
  },
  { timestamps: true }
);

const BuyPackage = mongoose.model("BuyPackage", buyPackageSchema);
export default BuyPackage;
