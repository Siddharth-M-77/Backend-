import mongoose from "mongoose";

const buyPackageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'User',  
      required: true
    },
    screenshot: [],
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const BuyPackage = mongoose.model("BuyPackage", buyPackageSchema);
export default BuyPackage;
