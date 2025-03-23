import { createContext } from "react";

export const LunchContext = createContext();

export const useLunch = (context) => {
  if (!context) {
    throw new Error("useLunch must be used with a LunchProvider");
  }
  return context;
};
