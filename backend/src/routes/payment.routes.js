import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  NequiPayment,
  verifyNequiPaymentLunch,
  saveTransaction,
  updateTransaccion,
} from "../controllers/payment.controller.js";
import { SaveTransaccionSchema } from "../schemas/savePayment.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

import { numberNequiValidateSchema } from "../schemas/payment.schema.js";

const router = Router();

router.post(
  "/pay-nequi",
  authRequired,
  validateSchema(numberNequiValidateSchema),
  NequiPayment
);

router.post("/nequi-verify", authRequired, verifyNequiPaymentLunch);

router.post(
  "/save-Payment",
  authRequired,
  validateSchema(SaveTransaccionSchema),
  saveTransaction
);

router.put("/update-transaccion/:orderId", authRequired, updateTransaccion);

export default router;
