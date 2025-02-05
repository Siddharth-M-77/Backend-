import mongoose from "mongoose";
// Connect to MongoDB

const connectToMongoDb = async () => {
  const MONGODB_URI = process.env.MONGODB_URL;
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
export default connectToMongoDb;
