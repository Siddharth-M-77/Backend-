import express from "express";
import {
  getUserProfile,
  registerUser,
  userLogin,
  userLogout,
  verifyOtp,
} from "../controllers/user.controller.js";
import IsAuthenticated from "../middleware/IsAuthenticated.js";
import { withdraw } from "../controllers/withdraw.controller.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/verify-otp").post(verifyOtp);
router.route("/profile").get(IsAuthenticated, getUserProfile);
router.route("/logout").get(IsAuthenticated, userLogout);
router.route("/withdraw").post(IsAuthenticated, withdraw);

export default router;
