import React, { createContext, useState, useContext } from "react";
import { registerRequest } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);

  const signup = async (user) => {
    try {
      setErrors([]); // Limpia los errores antes de intentar registrar
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
      console.log(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signup,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
