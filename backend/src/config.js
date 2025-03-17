import dotenv from "dotenv";
dotenv.config();
const {
  SECRET_KEY = "",
  PORT = "3000",
  MONGO_URI = "",
  TWILIO_ACCOUNT_SID = "",
  TWILIO_AUTH_TOKEN = "",
  TWILIO_NUMBER = "",
  PAYU_MERCHAT_ID = "",
  PAYU_API_LOGIN = "",
  PAYU_ACCOUNT_ID = "",
  PAYU_API_KEY = "",
  PAYU_API_URL = "",
} = process.env;
export const EnvConfig = () => ({
  TOKEN_SECRET: SECRET_KEY,
  PORT: PORT,
  MONGO_URI: MONGO_URI,
  accountSid: TWILIO_ACCOUNT_SID,
  authToken: TWILIO_AUTH_TOKEN,
  twilioNumber: TWILIO_NUMBER,
  payUapiKey: PAYU_API_KEY,
  payUaccountId: PAYU_ACCOUNT_ID,
  payUapiLogin: PAYU_API_LOGIN,
  payUmerchatId: PAYU_MERCHAT_ID,
  payUapiUrl: PAYU_API_URL,
});
