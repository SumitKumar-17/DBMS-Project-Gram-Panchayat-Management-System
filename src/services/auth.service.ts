import axios from "axios";
import { SignupData, LoginData, AuthResponse } from "@/types/auth";

const api = axios.create({
  baseURL: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/signup", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/login", data);
      const authResponse = response.data;

      // Validate response format
      if (!authResponse || typeof authResponse.code !== "number") {
        throw new Error("Invalid response format from server");
      }

      return authResponse;
    } catch (error) {
      console.error("Login request error:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },
};
