import mongoose from "mongoose";

const dematSchema = new mongoose.Schema({
    id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});
export const Demat = new mongoose.model("Demat", dematSchema);

export default Demat;
