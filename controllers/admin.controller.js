import { Admin } from "../models/admin.model.js";
import BuyPackage from "../models/packagebuy.model.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find admin by email
    const adminUser = await Admin.findOne({ email });
    if (!adminUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password using bcrypt
    const isMatch = await adminUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.secretKey,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Save token to cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Update last login
    adminUser.lastLogin = new Date();
    await adminUser.save();
    req.admin = adminUser;
    console.log(adminUser);

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: adminUser._id,
        email: adminUser.email,
        lastLogin: adminUser.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create Admin
export const createAdmin = async (req, res) => {
  try {
    const { email, password, name, mobile } = req.body;

    // Validate input karega
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if admin already hai
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(409)
        .json({ message: "Admin with this email already exists" });
    }

    // Create kardo admin ko
    const newAdmin = new Admin({
      email,
      password,
      role: "admin",
      name,
      mobile,
    });

    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: error.message });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const admin = req.id;
    const adminFound = await Admin.findById(admin);

    res.status(200)
      .json({ message: "Admin fetched successfully", user: adminFound });
  } catch (error) {
    console.error("Error in getAdmin", error);
  }
};

export const allUsers = async (req, res) => {
  try {
    const admin = req.id;

    const users = await User.find({ role: "user" }).select("-password -otp");
    const agents = await User.find({ role: "agent" }).select("-password -otp");

    res.status(200).json({ message: "All users", admin, agents, users });
  } catch (error) {
    console.error("Error in allUsers", error);
    res.status(500).json({ message: error.message });
  }
};
export const updateUserStatusApprove = async (req, res) => {
  try {
    console.log("userID", req.params.user_id);
    const userFound = await User.findById(req.params.user_id);
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }
    userFound.isPackage = "true";
    await userFound.save();
    res.status(200).json({ message: "User status updated", user: userFound });
  } catch (error) {
    console.error("Error in updateUserStatus", error);
    res.status(500).json({ message: error.message });
  }
};
export const updateUserStatusReject = async (req, res) => {
  try {
    const userFound = await User.findById(req.params.user_id);
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }
    userFound.isPackage = "false";
    await userFound.save();
    res.status(200).json({ message: "User status updated", user: userFound });
  } catch (error) {
    console.error("Error in updateUserStatus", error);
    res.status(500).json({ message: error.message });
  }
};
export const userBlock = async (req, res) => {
  try {
    const userFound = await user.findById(req.params.id);
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }
    userFound.userBlock = !userFound.userBlock;
    await userFound.save();
    res
      .status(200)
      .json({ message: "User blocked successfully", user: userFound });
  } catch (error) {
    console.error("Error in userBlock", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllBuyPackages = async (req, res) => {
  try {
    const buyPackages = await BuyPackage.find({}).populate("userId");

    res.status(200).json({
      message: "All buy packages fetched successfully",
      buyPackages,
    });
  } catch (error) {
    console.error("Error in getAllBuyPackages", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const updatePackageAmount = async(req,res)=>{
  try {
    const packageFound = await BuyPackage.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!packageFound) {
      return res.status(404).json({ message: "Buy package not found" });
    }
    res.status(200).json({
      message: "Buy package updated successfully",
      package: packageFound,
    });
    
  } catch (error) {
    console.error("Error in updatePackageAmount", error);
    res.status(500).json({
      message: error.message,
    });
    
  }
}