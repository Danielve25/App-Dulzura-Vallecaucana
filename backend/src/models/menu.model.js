import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    Descripcion: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);
