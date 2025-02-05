import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  userId:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ]
});

const Withdraw = mongoose.model("Withdraw", withdrawSchema);

export default Withdraw;
