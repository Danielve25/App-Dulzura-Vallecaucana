import { Router } from "express";
import { CreateMenu, getMenuToday } from "../controllers/Menu.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { menuValidate } from "../schemas/menu.schema.js";

const router = Router();

router.get("/menu", getMenuToday);

router.post(
  "/menu",
  validateSchema(menuValidate),
  authRequired,
  adminRequired,
  CreateMenu,
);

export default router;
