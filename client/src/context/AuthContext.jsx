import { useState, useContext, useEffect } from "react";
import {
  registerRequest,
  loginRequest,
  verityTokenRequest,
  getUsersRequest,
  logoutRequest,
} from "../api/auth";
import Cookies from "js-cookie";
import { AuthContext } from "../utils/authUtils";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (Array.isArray(error.response.data?.message)) {
        setErrors(error?.response?.data?.message);
      }
      setErrors([error.response.data.message]);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res);
      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data?.message)) {
        setErrors(error?.response?.data?.message);
      }
      setErrors([error.response.data.message]);
    }
  };

  const logout = () => {
    try {
      // Llamar al endpoint para que el servidor borre la cookie HttpOnly
      logoutRequest();
    } catch (error) {
      console.log("logout error:", error);
    }
    // También limpiar estado del cliente
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const getUsers = async () => {
    try {
      const res = await getUsersRequest();
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await verityTokenRequest();
        console.log(res);
        if (!res.data) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setLoading(false);
        setUser(null);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        loading,
        user,
        isAuthenticated,
        errors,
        getUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
