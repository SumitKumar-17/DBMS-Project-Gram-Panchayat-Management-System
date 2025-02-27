"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MonitorNavbar from "@/components/monitor/MonitorNavbar";
import StatsSummaryCards from "@/components/monitor/StatsSummaryCards";
import GenderDistributionChart from "@/components/monitor/GenderDistributionChart";
import CropDistributionChart from "@/components/monitor/CropDistributionChart";
import SchemeDistributionChart from "@/components/monitor/SchemeDistributionChart";
import { DashboardStats } from "@/types/monitor";
import { monitorService } from "@/services/monitor.service";

export default function MonitorDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await monitorService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!dashboardRef.current) return;

    try {
      const canvas = await html2canvas(dashboardRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("dashboard-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <MonitorNavbar
        userEmail={user?.email || ""}
        onGenerateReport={generatePDF}
        onLogout={logout}
      />

      <div
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
        ref={dashboardRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsSummaryCards
            totalCitizens={stats.totalCitizens}
            totalVaccinations={stats.vaccinationStats.totalVaccinations}
            totalLand={stats.landStats.totalLand}
            totalEnrollments={stats.schemeStats.totalEnrollments}
          />
          <GenderDistributionChart
            male={stats.genderDistribution.male}
            female={stats.genderDistribution.female}
          />
          <CropDistributionChart
            distribution={stats.landStats.cropDistribution}
          />
          <SchemeDistributionChart
            distribution={stats.schemeStats.schemeDistribution}
          />
        </div>
      </div>
    </div>
  );
}
