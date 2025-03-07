import dotenv from "dotenv";
dotenv.config();
export const TOKEN_SECRET = process.env.SECRET_KEY;
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const accountSid = process.env.TWILIO_ACCOUNT_SID;
export const authToken = process.env.TWILIO_AUTH_TOKEN;
export const twilioNumber = process.env.TWILIO_NUMBER;
