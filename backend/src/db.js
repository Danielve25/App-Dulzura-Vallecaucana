import mongoose from "mongoose";
import { EnvConfig } from "./config.js";
const config = EnvConfig();
export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log(">>> ✅ conectado a mongo");
  } catch (error) {
    console.log(error);
  }
};
