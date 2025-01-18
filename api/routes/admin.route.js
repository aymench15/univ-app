import express from "express";
import {
  getNotVerifiedDoctors,
  getAdmins,
  getPatients,
  getContributions,
  getEmails,
  addEmail,
  deleteEmail,
  getStatistics,
  getRandomFile
} from "../controllers/admin.controller.js";
import { verifyAdminToken } from "../middleware/adminJWT.js";
import Emails from '../models/acceptedEmails.model.js';
const router = express.Router();
router.post(
  "/get_notVerified_doctors",
  verifyAdminToken,
  getNotVerifiedDoctors
);
router.get("/admins", verifyAdminToken, getAdmins);
router.get("/patients", verifyAdminToken, getPatients);

router.get("/contributions",verifyAdminToken,getContributions)
router.get("/random-file",verifyAdminToken,getRandomFile)

router.get("/getEmails",verifyAdminToken,getEmails)
router.post("/addEmail",verifyAdminToken,addEmail)
router.delete("/deleteEmail/:id",verifyAdminToken,deleteEmail)
router.get("/statistics",verifyAdminToken,getStatistics)
export default router;
