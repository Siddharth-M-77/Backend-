import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const agentAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Agent is not authenticated. Token is missing.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Invalid token. Please log in again.",
        success: false,
      });
    }

    console.log("agent req id", decoded);
    req.id = decoded.id;

    const agent = await User.findById(req.id);
    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
        success: false,
      });
    }
    req.agent = agent;

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

export default agentAuth;
