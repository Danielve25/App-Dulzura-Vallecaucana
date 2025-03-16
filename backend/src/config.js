import dotenv from "dotenv";
dotenv.config();
const {
  TOKEN_SECRET = "",
  PORT = "3000",
  MONGO_URI = "",
  TWILIO_ACCOUNT_SID = "",
  TWILIO_AUTH_TOKEN = "",
  TWILIO_NUMBER = "",
} = process.env;
export const EnvConfig = () => ({
  TOKEN_SECRET: TOKEN_SECRET,
  PORT: PORT,
  MONGO_URI: MONGO_URI,
  accountSid: TWILIO_ACCOUNT_SID,
  authToken: TWILIO_AUTH_TOKEN,
  twilioNumber: TWILIO_NUMBER,
});
