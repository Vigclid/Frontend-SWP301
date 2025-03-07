import React, { createContext, useState, useContext, useEffect } from "react";
import { GoogleUser, Creator } from "../Interfaces/UserInterface";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  auth: Creator | null;
  storeUserData: (userData: Creator) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  auth: null,
  storeUserData: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthContextType["auth"]>(null);
  const redirect = useNavigate();

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        console.log("Initializing auth from session:", parsedAuth);
        setAuth(parsedAuth);
      } catch (error) {
        console.error("Error parsing stored auth:", error);
        sessionStorage.removeItem("auth");
      }
    }
  }, []);

  const storeUserData = (userData: AuthContextType["auth"]) => {
    console.log("Storing user data:", userData);
    setAuth(userData);
    sessionStorage.setItem("auth", JSON.stringify(userData));
  };

  const logout = () => {
    setAuth(null);
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("auth");
    redirect("/");
  };

  const contextValue: AuthContextType = {
    auth,
    storeUserData,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
