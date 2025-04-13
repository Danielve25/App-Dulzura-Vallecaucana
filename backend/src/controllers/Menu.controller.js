import Menu from "../models/menu.model.js";

export const CreateMenu = async (req, res) => {
  const { Descripcion } = req.body;

  const newMenu = new Menu({
    Descripcion,
  });
  const savedMenu = await newMenu.save();
  res.json(savedMenu);
};
export const getAllMenus = async (req, res) => {
  const menus = await Menu.find();
  res.json(menus);
};
