import { createContext, useContext, useState } from "react";
import { createLunchRequest, getLunchsRequest } from "../api/lunch";
const LunchContext = createContext();

export const useLunch = () => {
  const context = useContext(LunchContext);

  if (!context) {
    throw new Error("useLunch must be used with a LunchProvider");
  }
  return context;
};

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
    const res = await createLunchRequest(lunch);
    console.log(res);
  };

  return (
    <LunchContext.Provider
      value={{
        lunchs,
        createLunch,
        getLunchs,
      }}
    >
      {children}
    </LunchContext.Provider>
  );
}
