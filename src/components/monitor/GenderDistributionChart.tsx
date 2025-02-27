"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface GenderDistributionProps {
  male: number;
  female: number;
}

export default function GenderDistributionChart({
  male,
  female,
}: GenderDistributionProps) {
  const data = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [male, female],
        backgroundColor: ["#4F46E5", "#EC4899"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Gender Distribution</h2>
      <div className="h-64">
        <Pie data={data} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
