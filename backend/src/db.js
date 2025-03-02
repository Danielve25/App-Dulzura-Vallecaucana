import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(">>> ✅ conectado a mongo");
  } catch (error) {
    console.log(error);
  }
};
