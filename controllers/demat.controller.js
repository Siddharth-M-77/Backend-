import Demat from "../models/demat.model.js";
import bcrypt from "bcrypt";

export const demat = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!password || !id) {
      return res.status(400).json({
        message: "Please provide password and id",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const demat = await Demat.create({
      id,
      password: hashPassword,
    });
    res.status(201).json({
      message: "Demat account created successfully",
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
