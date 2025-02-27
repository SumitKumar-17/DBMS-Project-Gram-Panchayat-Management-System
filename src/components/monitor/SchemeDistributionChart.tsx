"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SchemeDistributionProps {
  distribution: { [key: string]: number };
}

export default function SchemeDistributionChart({
  distribution,
}: SchemeDistributionProps) {
  const data = {
    labels: Object.keys(distribution),
    datasets: [
      {
        data: Object.values(distribution),
        backgroundColor: Object.keys(distribution).map(
          (_, i) =>
            `hsl(${(i * 360) / Object.keys(distribution).length}, 70%, 50%)`
        ),
        borderColor: ["#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Scheme Distribution</h2>
      <div className="h-64">
        <Pie data={data} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
