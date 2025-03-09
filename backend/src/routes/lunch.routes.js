import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema } from "../schemas/task.schema.js";
const router = Router();

router.get("/lunchs", authRequired, getTasks);

router.get("/lunch/:id", authRequired, getTask);

router.post(
  "/lunch",
  authRequired,
  validateSchema(createTaskSchema),
  createTask
);

router.delete("/lunch/:id", authRequired, deleteTask);

router.put("/lunch/:id", authRequired, updateTask);

export default router;
