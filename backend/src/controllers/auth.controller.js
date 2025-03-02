import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import CreateAccessToken from "../../libs/jwt.js";

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
export const login = (req, res) => {
  res.send("login");
};
