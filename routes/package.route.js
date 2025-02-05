import express from "express";
import {
  buyPackage,
  getAllPackages,
} from "../controllers/packages.controller.js";
import IsAuthenticated from "../middleware/IsAuthenticated.js";
import upload from "../utils/DB/multer/multer.js";

const router = express.Router();

router.route("/").get(getAllPackages);

router
  .route("/upload-screenshot")
  .post(IsAuthenticated, upload.single("file"), buyPackage);

export default router;
