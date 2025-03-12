import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "No autorizado" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "token no valido" });
    req.user = user;
    next();
  });
};

export const adminRequired = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
};
