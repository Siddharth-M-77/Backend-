import express from "express";
import {
  getTree,
  getUserPairs,
  getUserProfile,
  registerUser,
  userLogin,
  userLogout,
  verifyOtp,
} from "../controllers/user.controller.js";
import IsAuthenticated from "../middleware/IsAuthenticated.js";
import { getWithdraw, withdraw } from "../controllers/withdraw.controller.js";
import { getAllDirectUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/verify-otp").post(verifyOtp);
router.route("/profile").get(IsAuthenticated, getUserProfile);
router.route("/logout").get(IsAuthenticated, userLogout);
router.route("/withdraw").post(IsAuthenticated, withdraw);
router.route("/get-withdraw").get(IsAuthenticated, getWithdraw);
router.route("/getDirectUsers").get(IsAuthenticated, getAllDirectUsers);
router.route("/getPairs").get(IsAuthenticated, getUserPairs);
router.route("/getTree").get(IsAuthenticated, getTree);

export default router;
