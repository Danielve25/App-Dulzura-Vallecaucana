import { createContext } from "react";

export const AuthContext = createContext();

export const useAuth = (context) => {
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
