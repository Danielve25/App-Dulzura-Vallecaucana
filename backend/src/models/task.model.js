import mongoose from "mongoose";
import { boolean, string } from "zod";

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
    onlysoup: {
      type: Boolean,
      required: false,
      default: false,
    },
    orderId: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Cambiado a false para permitir almuerzos pendientes sin usuario
    },
    nameClient: {
      type: String,
      required: false, // Nuevo campo para agrupar almuerzos pendientes por nombre de cliente
    },
    statePayment: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);
