import { Doughnut } from "react-chartjs-2";

interface AssetDistributionChartProps {
  distribution: {
    type: string;
    count: number;
  }[];
}

export default function AssetDistributionChart({
  distribution,
}: AssetDistributionChartProps) {
  const data = {
    labels: distribution.map((d) => d.type),
    datasets: [
      {
        data: distribution.map((d) => d.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(16, 185, 129, 0.5)",
          "rgba(245, 158, 11, 0.5)",
          "rgba(239, 68, 68, 0.5)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
