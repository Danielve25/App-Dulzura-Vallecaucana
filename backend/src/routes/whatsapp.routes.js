import { Router } from "express";
import { sendWhatsappMessage } from "../controllers/whatsapp.controller.js";
const router = Router();

router.post("/send-whatsapp-message", sendWhatsappMessage);
export default router;
