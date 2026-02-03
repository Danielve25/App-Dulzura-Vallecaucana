import Menu from "../models/menu.model.js";

export const CreateMenu = async (req, res) => {
  const { Descripcion } = req.body;
  const { date } = req.body;

  const newMenu = new Menu({
    Descripcion,
    date,
  });
  const savedMenu = await newMenu.save();
  res.json(savedMenu);
};
export const getMenuToday = async (req, res) => {
  const menus = await Menu.find({
    date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  });

  res.json(menus);
};
