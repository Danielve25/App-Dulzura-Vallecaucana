import { Router } from "express";
import {
  login,
  register,
  logout,
  profile,
  verifyToken,
  getAllUsers,
} from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { adminRequired, authRequired } from "../middlewares/validateToken.js";
const router = Router();

router.post("/register", validateSchema(registerSchema), register);

router.post("/login", validateSchema(loginSchema), login);

router.post("/logout", logout);

router.get("/profile", verifyToken);

router.get("/verify", authRequired, profile);

router.get("/users", authRequired, adminRequired, getAllUsers);

export default router;
