import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const IsAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "User is not authenticated. Token is missing.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.secretKey);

    if (!decoded || !decoded.userID) {
      return res.status(401).json({
        message: "Invalid token. Please log in again.",
        success: false,
      });
    }

    req.id = decoded.userID;
    console.log(req.id)

    const user = await User.findById(req.id);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not found" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired. Please log in again.",
        success: false,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token. Please log in again.",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Authentication failed due to a server error.",
      success: false,
    });
  }
};

export default IsAuthenticated;
