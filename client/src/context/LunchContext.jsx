import { useContext, useState } from "react";
import {
  createLunchRequest,
  getLunchsRequest,
  updateLunchRequest,
  getAllLunchsRequest,
} from "../api/lunch";
import { PayLunch, verifyPayment } from "../api/payment";
import { LunchContext, useLunch as baseUseLunch } from "../utils/lunchUtils";

export const useLunch = () => baseUseLunch(useContext(LunchContext));

export function LunchProvider({ children }) {
  const [lunchs, setLunch] = useState([]);

  const getLunchs = async () => {
    const res = await getLunchsRequest();
    try {
      setLunch(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createLunch = async (lunch) => {
    try {
      const res = await createLunchRequest(lunch);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const payLunch = async (lunchPayment) => {
    try {
      const res = await PayLunch(lunchPayment);
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const putLunch = async (DataPutLunch, lunchID) => {
    try {
      const res = await updateLunchRequest(DataPutLunch, lunchID);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPaymentNequi = async (VerifyData) => {
    try {
      const res = await verifyPayment(VerifyData);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllLunchs = async () => {
    try {
      const res = await getAllLunchsRequest();
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // const obteinByOrderID = async () => {
  //   try {
  //     const res = await obteinLunchByOrderID();
  //     return res;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <LunchContext.Provider
      value={{
        lunchs,
        createLunch,
        getLunchs,
        payLunch,
        putLunch,
        verifyPaymentNequi,
        getAllLunchs,
      }}
    >
      {children}
    </LunchContext.Provider>
  );
}
