import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
import dotenv from "dotenv";
// import Agent from "../models/agent.model.js";
import nodemailer from "nodemailer";
import Demat from "../models/demat.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import Table from "../models/table.model.js";
dotenv.config();

const secretKey = process.env.secretKey;
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, sponserId, position } = req.body;
    if (!name || !email || !password || !phone || !sponserId || !position) {
      return res.status(400).json({
        message: "Please fill all fields",
        success: false,
      });
    }
    const user = await User.findOne({ refer_id: sponserId });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send OTP email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP for Verification",
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      });
    } catch (emailError) {
      return res.status(500).json({
        message: "Failed to send OTP email",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = generateReferralCode(name);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      otp,
      sponsor_id: sponserId,
      position,
      refer_id: referralCode,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign({ userID: newUser._id }, secretKey, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
      })
      .json({
        message: "OTP sent to email. Please verify.",
        success: true,
        user: newUser,
        token,
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    // Generate JWT token
    const token = jwt.sign({ userID: user._id, role: user.role }, secretKey, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: false,
      })
      .json({ message: "Logged in successfully", success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;

    console.log("userProfile ID", userId);
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Fetch Profile",
      user,
      success: true,
    });
  } catch (error) {
    console.log("Profile Error :", error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: error,
    });
  }
};
function generateReferralCode(name) {
  if (!name || name.length < 4) {
    throw new Error("Name must be at least 4 characters long");
  }

  const namePart = name.substring(0, 4).toUpperCase(); // First 4 letters in uppercase
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 random digits

  return `${namePart}${randomDigits}`;
}
export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: error.message });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Validate OTP
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP", success: false });
    }

    // Clear OTP and expiration
    user.otp = null;
    user.otpExpires = null;

    // Find the agent (sponsor)
    const agent = await User.findOne({ refer_id: user.sponsor_id });
    console.log("agent hu mai ", agent);

    if (!agent) {
      return res
        .status(400)
        .json({ message: "Sponsor not found", success: false });
    }

    // Add user to agent's left or right array
    if (user.position === "Left") {
      agent.left.push(user._id);
    } else if (user.position === "Right") {
      agent.right.push(user._id);
    } else {
      return res
        .status(400)
        .json({ message: "Invalid position", success: false });
    }
    agent.partners.push(user._id);

    // Save the agent after pushing the user to the left or right array
    await agent.save();

    const token = jwt.sign({ userID: user._id }, secretKey, {
      expiresIn: "1d",
    });

    // Send response
    return res
      .status(200)
      .json({ message: "User verified successfully", success: true, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error: " + error.message, success: false });
  }
};
export const getAllDirectUsers = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId)
      .populate("left right")
      .populate("left right");
    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Agent not found", success: false });
    }
    const directUsers = user.left.concat(user.right);
    return res.status(200).json({
      message: "Direct users fetched successfully",
      success: true,
      directUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
export const getTree = async (req, res) => {
  try {
    const userId = req.id;

    // Fetch the root user
    const rootUser = await User.findById(userId);
    if (!rootUser) {
      return res
        .status(404)
        .json({ message: "Agent not found", success: false });
    }

    // Helper function to recursively build the tree and fetch left/right nodes manually
    const buildTree = async (user) => {
      if (!user) return null;

      // Fetch the left and right children (manually populate)
      const leftChildren = user.left
        ? await Promise.all(user.left.map((childId) => fetchChild(childId)))
        : [];
      const rightChildren = user.right
        ? await Promise.all(user.right.map((childId) => fetchChild(childId)))
        : [];

      return {
        id: user._id,
        name: user.name || "Unknown",
        left: leftChildren,
        right: rightChildren,
      };
    };

    // Helper function to fetch a child user and recursively populate its left and right
    const fetchChild = async (childId) => {
      const childUser = await User.findById(childId);
      if (!childUser) return null;

      const leftChildren = childUser.left
        ? await Promise.all(
            childUser.left.map((childId) => fetchChild(childId))
          )
        : [];
      const rightChildren = childUser.right
        ? await Promise.all(
            childUser.right.map((childId) => fetchChild(childId))
          )
        : [];

      return {
        id: childUser._id,
        name: childUser.name || "Unknown",
        left: leftChildren,
        right: rightChildren,
      };
    };

    // Build the full tree starting from the root user
    const tree = await buildTree(rootUser);

    return res.status(200).json({
      message: "Tree fetched successfully",
      success: true,
      tree,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
export const getUserPairs = async (req, res) => {
  try {
    const userId = req.id;

    // Fetch user and populate only immediate left and right children
    const user = await User.findById(userId).populate("left right")
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const leftUsers = user.left || [];
    const rightUsers = user.right || [];
    const teams = [];

    const maxLength = Math.min(leftUsers.length, rightUsers.length);

    // Creating teams by pairing one left and one right user
    for (let i = 0; i < maxLength; i++) {
      teams.push({
        left: leftUsers[i],
        right: rightUsers[i],
      });
    }

    return res.status(200).json({
      message: `${teams.length} teams created successfully`,
      success: true,
      teams,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
