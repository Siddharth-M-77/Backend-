import express from "express";
import {
  allUsers,
  createAdmin,
  getAdmin,
  getAllBuyPackages,
  loginAdmin,
  logoutAdmin,
  updateUserStatusApprove,
  updateUserStatusReject,
  userBlock,
} from "../controllers/admin.controller.js";
import adminAuthentication from "../middleware/adminAuthentication.js";
import {
  getAllDematAccounts,
  getAllWithdraw,
} from "../controllers/withdraw.controller.js";
import {
  createPackage,
  getAllPackages,
} from "../controllers/packages.controller.js";
const router = express.Router();
router.route("/login").post(loginAdmin);
router.route("/register").post(adminAuthentication, createAdmin);
router.route("/logout").post(adminAuthentication, logoutAdmin);
router.route("/getAdmin").get(adminAuthentication, getAdmin);
router
  .route("/update-user-status/approve/:user_id")
  .get(updateUserStatusApprove);
router
  .route("/update-user-status/reject/:user_id")
  .get(adminAuthentication, updateUserStatusReject);
router.route("/all-users").get(adminAuthentication, allUsers);
router.route("/user-block/:id").get(adminAuthentication, userBlock);
router.route("/getAllWithdraw").get(adminAuthentication, getAllWithdraw);
router.route("/createPackage").post(adminAuthentication, createPackage);
router.route("/getDematAccounts").get(adminAuthentication, getAllDematAccounts);
// router.route("/getDematAccounts").get(adminAuthentication, getAllDematAccounts);
router.route("/getAllBuyPackages").get(getAllBuyPackages);

export default router;
