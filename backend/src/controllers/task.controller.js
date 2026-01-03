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
    onlysoup,
    userneedstray,
    portionOfProtein,
    portionOfSalad,
    userneedsextrajuice,
    statePayment,
  } = req.body;

  // Calcular el valor de userNeedsPay
  let userNeedsPay = 0;
  if (portionOfProtein) userNeedsPay += 8000;
  if (portionOfSalad) userNeedsPay += 3000;
  if (userneedscomplete) userNeedsPay += 16000;
  if (userneedstray) userNeedsPay += 15000;
  if (userneedsextrajuice) userNeedsPay += 1000;
  if (onlysoup) userNeedsPay += 5000;

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
    onlysoup,
    userNeedsPay, // Guardar el valor calculado
    statePayment,

    user: req.user.id,
  });
  const savedTask = await newTask.save();
  res.json(savedTask);
};

export const createLunchByAdmin = async (req, res) => {
  const {
    title,
    userneedscomplete,
    userneedstray,
    userneedsextrajuice,
    portionOfProtein,
    portionOfSalad,
    userNeedsPay,
    date,
    pay,
    onlysoup,
    user, // Puede ser ID, objeto o null
    nameClient, // Nuevo campo para almuerzos pendientes
    statePayment,
  } = req.body;

  // Calcular userNeedsPay si no se proporciona
  let calculatedUserNeedsPay = userNeedsPay || 0;
  if (!userNeedsPay) {
    if (portionOfProtein) calculatedUserNeedsPay += 8000;
    if (portionOfSalad) calculatedUserNeedsPay += 3000;
    if (userneedscomplete) calculatedUserNeedsPay += 16000;
    if (userneedstray) calculatedUserNeedsPay += 15000;
    if (userneedsextrajuice) calculatedUserNeedsPay += 1000;
    if (onlysoup) calculatedUserNeedsPay += 5000;
  }

  let userId = null; // Por defecto null para almuerzos pendientes
  let clientName = nameClient || null;

  // Si user es un objeto, buscar o crear un nuevo usuario
  if (typeof user === "object" && user !== null) {
    if (!user.NameStudent || !user.grade) {
      return res.status(400).json({
        message:
          "NameStudent y grade son requeridos para asignar o crear un usuario",
      });
    }
    let existingUser = await User.findOne({ NameStudent: user.NameStudent });
    if (existingUser) {
      userId = existingUser._id;
      clientName = null; // Si hay usuario, no usar nameClient
    } else {
      const newUser = new User({
        NameStudent: user.NameStudent,
        PhoneNumber: user.PhoneNumber || "",
        PhoneNumberReal: user.PhoneNumberReal || "",
        grade: user.grade,
        isAdmin: user.isAdmin || false,
      });
      const savedUser = await newUser.save();
      userId = savedUser._id;
      clientName = null;
    }
  } else if (user) {
    // Si es un string (ID), usarlo
    userId = user;
    clientName = null;
  } else if (nameClient) {
    // Si no hay user pero hay nameClient, es un almuerzo pendiente
    userId = null;
    clientName = nameClient.toUpperCase(); // Asegurar mayúsculas como en NameStudent
  } else {
    return res.status(400).json({
      message:
        "Debe proporcionar un usuario existente, datos para crear uno, o un nameClient para almuerzo pendiente",
    });
  }

  const newTask = new Task({
    title: title || "Almuerzo",
    userneedscomplete: userneedscomplete || false,
    userneedstray: userneedstray || false,
    userneedsextrajuice: userneedsextrajuice || false,
    portionOfProtein: portionOfProtein || false,
    portionOfSalad: portionOfSalad || false,
    userNeedsPay: calculatedUserNeedsPay,
    date: date || new Date(),
    pay: pay || false,
    onlysoup: onlysoup || false,
    user: userId,
    nameClient: clientName,
    statePayment: statePayment || "",
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

export const assignPendingLunches = async (req, res) => {
  const { userId, nameClient } = req.body;

  try {
    await Task.updateMany(
      { nameClient: nameClient.toUpperCase(), user: null },
      { user: userId, nameClient: null }
    );
    res.json({ message: "Almuerzos pendientes asignados al usuario" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
