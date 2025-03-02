import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import CreateAccessToken from "../libs/jwt.js";

export const register = async (req, res) => {
  const { NameStudent, PhoneNumber } = req.body;

  try {
    const phoneNumberhash = await bcrypt.hash(PhoneNumber, 10);

    const NewUser = new User({
      NameStudent,
      PhoneNumber: phoneNumberhash,
    });

    const userSaved = await NewUser.save();
    const token = await CreateAccessToken({ id: userSaved._id });

    res.cookie("token", token);
    res.json({
      message: "Usuario creado",
      _id: userSaved._id,
      NameStudent: userSaved.NameStudent,
      PhoneNumber: userSaved.PhoneNumber,
      creastedAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { NameStudent, PhoneNumber } = req.body;

  try {
    const userFound = await User.findOne({ NameStudent });

    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(PhoneNumber, userFound.PhoneNumber);

    if (!isMatch) return res.status(400).json({ message: "numero incorrecto" });

    const token = await CreateAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      message: "iniciaste sesion",
      _id: userFound._id,
      NameStudent: userFound.NameStudent,
      PhoneNumber: userFound.PhoneNumber,
      creastedAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
