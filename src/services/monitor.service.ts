import axios from "axios";
import { DashboardStats } from "@/types/monitor";

const api = axios.create({
  baseURL: "/api/monitor",
  headers: {
    "Content-Type": "application/json",
  },
});

export const monitorService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStats>("/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching monitor stats:", error);
      throw error;
    }
  },
};
