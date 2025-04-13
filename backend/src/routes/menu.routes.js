import { Router } from "express";
import { CreateMenu, getAllMenus } from "../controllers/Menu.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { menuValidate } from "../schemas/menu.schema.js";

const router = Router();

router.get("/menu", getAllMenus);

router.post(
  "/create-menu",
  validateSchema(menuValidate),
  authRequired,
  adminRequired,
  CreateMenu
);

export default router;
