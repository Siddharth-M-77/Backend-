import jwt from "jsonwebtoken";

const adminAuthentication = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "User is not authenticated. Token is missing.",
        success: false,
      });
    }
    console.log(token)

    const decoded = jwt.verify(token, process.env.secretKey);
    console.log(decoded);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token.",
        success: false,
      });
    }

    req.id = decoded.id;

    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    // Handle token expiration or other JWT-related errors
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

    // General server error
    return res.status(500).json({
      message: "Authentication failed due to a server error.",
      success: false,
    });
  }
};

export default adminAuthentication;
