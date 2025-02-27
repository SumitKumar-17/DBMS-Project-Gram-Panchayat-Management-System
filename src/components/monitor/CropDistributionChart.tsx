"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CropDistributionProps {
  distribution: { [key: string]: number };
}

export default function CropDistributionChart({
  distribution,
}: CropDistributionProps) {
  const data = {
    labels: Object.keys(distribution),
    datasets: [
      {
        label: "Crop Distribution (Acres)",
        data: Object.values(distribution),
        backgroundColor: "#4F46E5",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Crop Distribution</h2>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
