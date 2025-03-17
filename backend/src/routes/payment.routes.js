import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { NequiPayment } from "../controllers/payment.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { numberNequiValidateSchema } from "../schemas/payment.schema.js";

const router = Router();

router.post(
  "/pay-nequi",
  authRequired,
  validateSchema(numberNequiValidateSchema),
  NequiPayment
);

export default router;
