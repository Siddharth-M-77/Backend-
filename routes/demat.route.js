import express from "express";
import { demat } from "../controllers/demat.controller.js";
import IsAuthenticated from "../middleware/IsAuthenticated.js";

const router = express.Router();

router.route("/").post(IsAuthenticated, demat);

export default router;
