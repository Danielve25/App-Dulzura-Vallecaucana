import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import CreateAccessToken from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { EnvConfig } from "../config.js";

const config = EnvConfig();

export const register = async (req, res) => {
  const { NameStudent, PhoneNumber, isAdmin } = req.body;

  try {
    const upperCaseName = NameStudent.toUpperCase();
    const userFound = await User.findOne({ NameStudent: upperCaseName });
    if (userFound)
      return res
        .status(400)
        .json({ message: "no no no, ese ya existe intentalo con otro" });

    const phoneNumberhash = await bcrypt.hash(PhoneNumber, 10);

    const NewUser = new User({
      NameStudent: upperCaseName,
      PhoneNumber: phoneNumberhash,
      isAdmin: isAdmin || false, // Asegurarse de que isAdmin sea false si no se proporciona
    });

    const userSaved = await NewUser.save();
    const token = await CreateAccessToken({ id: userSaved._id });

    res.cookie("token", token);
    res.json({
      message: "Usuario creado",
      _id: userSaved._id,
      NameStudent: userSaved.NameStudent,
      PhoneNumber: userSaved.PhoneNumber,
      isAdmin: userSaved.isAdmin,
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
    const upperCaseName = NameStudent.toUpperCase();
    const userFound = await User.findOne({ NameStudent: upperCaseName });

    if (!userFound)
      return res
        .status(400)
        .json({ message: "ah! te equivocaste intentalo nuevamente" });

    const isMatch = await bcrypt.compare(PhoneNumber, userFound.PhoneNumber);

    if (!isMatch)
      return res.status(400).json({
        message: "ah! te equivocaste intentalo con el numero correcto",
      });

    const token = await CreateAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      message: "iniciaste sesion",
      _id: userFound._id,
      NameStudent: userFound.NameStudent,
      PhoneNumber: userFound.PhoneNumber,
      creastedAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      isAdmin: userFound.isAdmin,
      token: token,
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

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound)
    return res.status(400).json({ message: "Usuario no encontrado" });

  return res.json({
    id: userFound._id,
    NameStudent: userFound.NameStudent,
    creastedAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
    isAdmin: userFound.isAdmin,
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookie;

  if (!token) return res.status(401).json({ message: "no autorizado" });

  jwt.verify(token, config.TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "no autorizado" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "no autorizado" });

    return res.json({
      id: userFound._id,
      NameStudent: userFound.NameStudent,
      PhoneNumber: userFound.PhoneNumber,
    });
  });
};
