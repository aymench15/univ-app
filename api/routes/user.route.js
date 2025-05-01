import express from "express";
import {
  deleteUser,
  getUser,
  userUpdate,
  checkoutSession,
  verifyEmailUsers,
  uploadDocuments,

} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { authorizeRole } from "../middleware/jwt.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage(),  limits: {
  fileSize: 10 * 1024 * 1024 // 10MB
} });
const router = express.Router();

router.delete("/:id", deleteUser);


router.post("/profile/me", verifyToken, getUser);
router.put("/usersupdate", upload.single("photo"), userUpdate);
router.post("/bookings/checkout-session", checkoutSession);

router.get("/:id/verify/:token/", verifyEmailUsers);

router.post("/documents-upload",verifyToken,upload.single("file"),uploadDocuments);

export default router;
