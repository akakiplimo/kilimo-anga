// apps/mobile/context/auth.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { requestOTP, verifyOTP } from "../services/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (phoneNumber: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestOtp: (phoneNumber: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  requestOtp: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      setIsAuthenticated(!!token);
    } catch (error) {
      console.log("Failed to get auth status", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (phoneNumber: string, otp: string) => {
    const { token } = await verifyOTP(phoneNumber, otp);
    await SecureStore.setItemAsync("authToken", token);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setIsAuthenticated(false);
  };

  const requestOtp = async (phoneNumber: string) => {
    await requestOTP(phoneNumber);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
        requestOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
