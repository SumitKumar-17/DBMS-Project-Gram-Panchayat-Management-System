"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600">Error: {error}</p>
      </div>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-yellow-600">No data available</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm">
        <MonitorNavbar
          userEmail={user?.email || ""}
          onGenerateReport={generatePDF}
          onLogout={logout}
        />
      </div>

      <div
        className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8"
        ref={dashboardRef}
      >

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Monitoring Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of Panchayat Statistics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            <StatsSummaryCards
              totalCitizens={stats.totalCitizens}
              totalVaccinations={stats.vaccinationStats.totalVaccinations}
              totalLand={stats.landStats.totalLand}
              totalEnrollments={stats.schemeStats.totalEnrollments}
            />
          </div>

          <div className="bg-white  text-black rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
            <GenderDistributionChart
              male={stats.genderDistribution.male}
              female={stats.genderDistribution.female}
            />
          </div>

          <div className="bg-white text-black rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            <h3 className="text-lg font-semibold  text-gray-900 mb-4">Crop Distribution</h3>
            <CropDistributionChart
              distribution={stats.landStats.cropDistribution}
            />
          </div>

          <div className="bg-white text-black rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheme Distribution</h3>
            <SchemeDistributionChart
              distribution={stats.schemeStats.schemeDistribution}
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
