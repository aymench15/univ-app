import express from "express";
import { sendContactMessage } from "../controllers/contact.controller.js";
const router = express.Router();

router.post("/contact-us", sendContactMessage);

export default router;
