import express from "express";
import {
  allUsers,
  allUsersEquity,
  createAdmin,
  getAdmin,
  getAllBuyPackages,
  loginAdmin,
  logoutAdmin,
  updatePackageAmount,
  updateUserEquintity,
  updateUserEquityApprove,
  updateUserStatusApprove,
  updateUserStatusReject,
  userBlock,
  userStatus,
} from "../controllers/admin.controller.js";
import adminAuthentication from "../middleware/adminAuthentication.js";
import {
  getAllDematAccounts,
  getAllWithdraw,
} from "../controllers/withdraw.controller.js";
import {
  createPackage,
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
router.route("/getDematAccounts").get(adminAuthentication, getAllDematAccounts);
router.route("/getAllBuyPackages").get(getAllBuyPackages);
router.route("/updateUserStatus/:userId").get(userStatus);
router.route("/updatePackageAmount").get(updatePackageAmount);
router.route("/updateIsequity/:user_id").post(updateUserEquintity);
router.route("/getPendingEquityUsers").get(allUsersEquity);
router.route("/approveEquity/:userId").get(updateUserEquityApprove);

export default router;
