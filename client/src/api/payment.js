import axios from "./axios";

export const PayLunch = (lunch) => axios.post("/pay-nequi", lunch);
export const verifyPayment = (verifyPay) =>
  axios.post("/nequi-verify", verifyPay);
export const savePayment = (payment) => axios.post("/save-Payment", payment);

export const editPaymentStatus = ({ OrderId, payment }) =>
  axios.put(`/update-transaccion/${OrderId}`, payment);
