import Demat from "../models/demat.model.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";

export const demat = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!password || !id) {
      return res.status(400).json({
        message: "Please provide both ID and password",
        success: false,
      });
    }

    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Hash password securely
    const hashPassword = await bcrypt.hash(password, 10);

    // Update user demat info
    user.dematId = id;
    user.dematPassword = hashPassword;
    await user.save();

    // Optional: Store in separate Demat collection
    await Demat.create({
      userId: user._id,
      id,
      password: hashPassword,
    });

    return res.status(201).json({
      message: "Demat account added successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getDematAccounts = async (req, res) => {
  try {
    const dematAccounts = await Demat.find();
    res.json({ dematAccounts, success: true });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
