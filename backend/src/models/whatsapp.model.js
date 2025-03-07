import mongoose from "mongoose";

const whatsappMessageSchema = new mongoose.Schema({
  to: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Establece el campo date automáticamente
  sid: { type: String, required: true }, // Agrega el campo sid
});

const WhatsappMessage = mongoose.model(
  "WhatsappMessage",
  whatsappMessageSchema
);

export default WhatsappMessage;
