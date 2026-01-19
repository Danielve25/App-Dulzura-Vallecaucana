import { Router } from "express";
import { authRequired, adminRequired } from "../middlewares/validateToken.js";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getTaskByOrderId,
  createLunchByAdmin,
  assignPendingLunches, // Agrega esta línea aquí
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
  createTask,
);

router.delete("/lunch/:id", authRequired, deleteTask);

router.put("/lunch/:id", authRequired, adminRequired, updateTask);

// Ruta para que el administrador obtenga todas las tareas
router.get("/admin/lunchs", authRequired, adminRequired, getAllTasks);

router.get("/lunch/order/:orderId", authRequired, getTaskByOrderId);

router.post("/admin/lunch", authRequired, adminRequired, createLunchByAdmin);

router.put(
  "/admin/assign-pending",
  authRequired,
  adminRequired,
  assignPendingLunches,
);
router.delete("/admin/lunch/:id", authRequired, adminRequired, deleteTask);

export default router;
