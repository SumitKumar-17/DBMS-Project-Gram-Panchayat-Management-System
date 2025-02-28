import axios from "axios";
import { DashboardStats } from "@/types/monitor";

export const monitorService = {
  async getStats(): Promise<DashboardStats> {
    const response = await axios.get("/api/monitor/stats");
    return response.data;
  },
};
