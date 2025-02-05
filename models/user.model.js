// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       unique: true,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     position: {
//       type: String,
//     },
//     otp: {
//       type: String,
//       default: null,
//     },
//     otpExpires: {
//       type: Date,
//       default: null,
//     },
//     sponserId: {
//       type: String,
//       default: null,
//     },
//     agentSponserId: {
//       type: String,
//       // required: true,
//     },
//     isPackage: {
//       type: Boolean,
//       default: false,
//     },
//     isEquityInvest: {
//       type: Boolean,
//       default: false,
//     },
//     purchasePackes: [
//       {
//         packageId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "BuyPackage",
//         },
//       },
//     ],
//     left: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     right: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//   },

//   {
//     timestamps: true,
//   }
// );

// export const User = mongoose.model("User", userSchema);
