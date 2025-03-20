import axios from "./axios";

export const PayLunch = (lunch) => axios.post("/pay-nequi", lunch);
export const verifyPayment = (verifyPay) =>
  axios.post("/nequi-verify", verifyPay);
