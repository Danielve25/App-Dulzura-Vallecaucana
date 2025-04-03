import React, { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest } from "../api/auth";

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

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

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
  const signin = async (user) => {
    try {
      setErrors([]);
      const res = await loginRequest(user);
      console.log(res.data);
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
        signin,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
