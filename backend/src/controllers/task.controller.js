import Task from "../models/task.model.js";
import User from "../models/user.model.js";

export const getTasks = async (req, res) => {
  // lógica para obtener todas las tareas
  const tasks = await Task.find({
    user: req.user.id,
  }).populate("user");
  res.json(tasks);
};

export const getAllTasks = async (req, res) => {
  // lógica para obtener todas las tareas para el administrador
  const tasks = await Task.find().populate("user");
  res.json(tasks);
};

export const createTask = async (req, res) => {
  // lógica para crear una nueva tarea
  const {
    title,
    description,
    date,
    pay,
    userneedscomplete,
    orderId,
    userneedstray,
    portionOfProtein,
    portionOfSalad,
    userneedsextrajuice,
    statePayment,
  } = req.body;

  // Calcular el valor de userNeedsPay
  let userNeedsPay = 0;
  if (portionOfProtein) userNeedsPay += 6000;
  if (portionOfSalad) userNeedsPay += 3000;
  if (userneedscomplete) userNeedsPay += 14000;
  if (userneedstray) userNeedsPay += 13000;
  if (userneedsextrajuice) userNeedsPay += 1000;

  const newTask = new Task({
    title,
    orderId,
    description,
    date,
    userneedscomplete,
    userneedstray,
    userneedsextrajuice,
    portionOfProtein,
    portionOfSalad,
    pay,
    userNeedsPay, // Guardar el valor calculado
    statePayment,
    user: req.user.id,
  });
  const savedTask = await newTask.save();
  res.json(savedTask);
};

export const getTask = async (req, res) => {
  // lógica para obtener una tarea por ID
  const task = await Task.findById(req.params.id).populate("user");
  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.json(task);
};

export const getTaskByOrderId = async (req, res) => {
  // lógica para obtener una tarea por orderId
  const task = await Task.findOne({ orderId: req.params.orderId }).populate(
    "user"
  );
  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.json(task);
};

export const deleteTask = async (req, res) => {
  // lógica para eliminar una tarea por ID
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.sendStatus(204);
};

export const updateTask = async (req, res) => {
  // lógica para actualizar una tarea por ID
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};
