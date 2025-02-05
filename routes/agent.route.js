import express from "express";
import {
  agentLogin,
  agentRegister,
  getAgentInfo,
  getAllDirectUsers,
  getTree,
  getUserPairs,
  // getUserPair,
} from "../controllers/agent.controller.js";
// import agentAuth from "../middleware/agentAuth.js";
import agentAuth from "../middleware/agentAuth.js";
import IsAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(agentRegister);
router.route("/login").post(agentLogin);
router.route("/getPair/:agentId").get(agentAuth, getUserPairs);
router.route("/get-agentInfo").get(agentAuth, getAgentInfo);
router.route("/getTree").get(agentAuth, getTree);
router.route("/getDirectUsers").get(agentAuth, getAllDirectUsers);
router.route("/getDirectUsers").get(IsAuthenticated, getAllDirectUsers);

export default router;
