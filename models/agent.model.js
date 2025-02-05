import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    sponserId: {
      type: String,
      required: true,
    },
    left: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    right: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Agent = new mongoose.model("Agent", agentSchema);
export default Agent;
