import User from "../models/user.model.js";

export const register = async (req, res) => {
  const { NameStudent, PhoneNumber } = req.body;

  try {
    const NewUser = new User({
      NameStudent,
      PhoneNumber,
    });

    const userSaved = await NewUser.save();
    res.json(userSaved);
  } catch (error) {
    console.log("ya existe este usuario");
    res.send("ya existe este usuario");
  }
};
export const login = (req, res) => {
  res.send("login");
};
