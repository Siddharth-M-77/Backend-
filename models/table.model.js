import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
});
export const Table = new mongoose.model("Table", tableSchema);
export default Table;
