import BuyPackage from "../models/packagebuy.model.js";
import Table from "../models/table.model.js";
import { uploadMedia } from "../utils/DB/cloudinary/cloudinary.js";

export const createPackage = async (req, res) => {
  try {
    const { name, amount } = req.body;
    if (!name || !amount) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const table = await Table.create({ name, amount });

    res.status(201).json({
      message: "Package created successfully",
      success: true,
      table,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error: " + error.message,
      success: false,
    });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await Table.find({});
    res.status(200).json({
      message: "Packages fetched successfully",
      success: true,
      packages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error: " + error.message,
      success: false,
    });
  }
};

export const buyPackage = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.id;
    const file = req.file;
    const image = file.path;
    if (!amount) {
      return res.status(400).json({
        message: "Amount required",
        success: false,
      });
    }

    if (!image) {
      return res.status(400).json({
        message: "Image file required",
        success: false,
      });
    }
    const cloudresponse = await uploadMedia(image);

    if (!cloudresponse) {
      return res.status(400).json({
        message: "Failed to upload image",
        success: false,
      });
    }

    const url = cloudresponse.secure_url;
    const buyPackage = await BuyPackage.create({
      amount,
      screenshot: url,
      userId,
    });
    res.status(200).json({
      message: "Response uploaded successfully",
      success: true,
      buyPackage,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error: " + error.message,
      success: false,
    });
  }
};
