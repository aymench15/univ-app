import express from "express";
import {
  register,
  login,
  logout,
  load,
  adminLogin,
  loadAdmin,
  forgetPassword,
  updatePassword,
  adminRegister,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { verifyAdminToken } from "../middleware/adminJWT.js";
// import { verifyDoctorToken } from "../middleware/doc-patientJWT.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/register", upload.single("photo"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/load", verifyToken, load);
router.get("/loadAdmin", verifyAdminToken, loadAdmin);
// router.get("/loadDoctor", verifyDoctorToken, loadDoctor);
router.post("/adminLogin", adminLogin);
router.post("/adminRegister", adminRegister);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password", updatePassword);

export default router;
