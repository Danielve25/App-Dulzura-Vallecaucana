import mongoose from "mongoose";
import { boolean } from "zod";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      default: "Almuerzo",
    },
    userneedscomplete: {
      type: Boolean,
      required: false,
      default: false,
    },
    userneedstray: {
      type: Boolean,
      required: false,
      default: false,
    },
    userneedsextrajuice: {
      type: Boolean,
      required: false,
      default: false,
    },
    portionOfProtein: {
      type: Boolean,
      required: false,
      default: false,
    },
    portionOfSalad: {
      type: Boolean,
      required: false,
      default: false,
    },
    userNeedsPay: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    pay: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);
