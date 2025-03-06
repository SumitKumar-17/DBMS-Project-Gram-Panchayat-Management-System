"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthUser } from "@/types/auth";
import Cookies from "js-cookie";

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check for stored user data on mount
    try {
      const storedUser = localStorage.getItem("user");
      const token = Cookies.get("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading stored user:", error);
      handleLogout();
    }
  }, []);

  const login = (userData: AuthUser) => {
    try {
      console.log("Setting user data in context:", userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    // Clear all stored data
    setUser(null);
    localStorage.clear(); 
    Cookies.remove("token", { path: "/" }); 
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
