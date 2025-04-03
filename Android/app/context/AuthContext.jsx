import React, { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      setErrors([]);
      const res = await registerRequest(user);
      await AsyncStorage.setItem("token", res.data.token); // Guardar el token
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
      await AsyncStorage.setItem("token", res.data.token); // Guardar el token
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
      console.log(errorMessage);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token"); // Eliminar el token
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signup,
        signin,
        logout,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
