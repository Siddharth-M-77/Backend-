import Demat from "../models/demat.model.js";
import Withdraw from "../models/widrawal.model.js";

export const withdraw = async (req, res) => {
  try {
    const { amount, address } = req.body;
    if (!amount || !address) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const withdrawal = await Withdraw.create({ amount, address });
    return res.status(201).json({ withdrawal, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllWithdraw = async (req, res) => {
  try {
    const withdrawals = await Withdraw.find({});
    return res.status(200).json({ withdrawals, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllDematAccounts = async (req, res) => {
  try {
    const dematAccounts = await Demat.find({});
    return res.status(200).json({ dematAccounts, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
