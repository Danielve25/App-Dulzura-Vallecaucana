import { useContext, useState } from "react";
import {
  createLunchRequest,
  getLunchsRequest,
  updateLunchRequest,
  getAllLunchsRequest,
  createLunchAdminRequest,
  assignPendingLunchesRequest, // <- Agrega esta línea aquí
} from "../api/lunch";
import { PayLunch, verifyPayment } from "../api/payment";
import { LunchContext, useLunch as baseUseLunch } from "../utils/lunchUtils";

export const useLunch = () => baseUseLunch(useContext(LunchContext));

export function LunchProvider({ children }) {
  const [lunchs, setLunch] = useState([]);

  const CreateLunchAdmin = async (lunch) => {
    try {
      const res = await createLunchAdminRequest(lunch);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getLunchs = async () => {
    const res = await getLunchsRequest();
    try {
      setLunch(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createLunch = async (lunch) => {
    return await createLunchRequest(lunch);
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

  const assignPendingLunches = async (data) => {
    try {
      const res = await assignPendingLunchesRequest(data);
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
        CreateLunchAdmin,
        assignPendingLunches, // <- Agrega esta línea aquí
      }}
    >
      {children}
    </LunchContext.Provider>
  );
}
