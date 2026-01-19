import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  login,
  register,
  logout,
  profile,
  verifyToken,
  getAllUsers,
  UpdateOutstandingbalance,
} from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { adminRequired, authRequired } from "../middlewares/validateToken.js";
const router = Router();
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // máximo 10 intentos por IP cada minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiados intentos. Intenta de nuevo en 1 minuto.",
});

router.post("/register", validateSchema(registerSchema), authLimiter, register);

router.post("/login", validateSchema(loginSchema), authLimiter, login);

router.post("/logout", logout);

router.get("/profile", verifyToken);

router.get("/verify", authRequired, profile);

router.get("/users", authRequired, adminRequired, getAllUsers);

router.patch(
  "/users/:id/outstandingbalance",
  authRequired,
  adminRequired,
  UpdateOutstandingbalance,
);

export default router;
