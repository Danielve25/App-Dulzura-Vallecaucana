import twilio from "twilio";
import { EnvConfig } from "../config.js";
import WhatsappMessage from "../models/whatsapp.model.js"; // Importa el modelo

const config = EnvConfig();

export const sendWhatsappMessage = async (req, res) => {
  let { to, body } = req.body;

  const client = twilio(config.accountSid, config.authToken);

  // Concatena 'whatsapp:+57' al número recibido
  to = `whatsapp:+57${to}`;

  try {
    const message = await client.messages.create({
      from: twilioNumber,
      body,
      to,
    });

    // Guarda el mensaje en MongoDB
    const newMessage = new WhatsappMessage({
      to,
      body,
      sid: message.sid, // Incluye el campo sid
    });
    await newMessage.save();

    res.json({ message: "Message sent", sid: message.sid });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
