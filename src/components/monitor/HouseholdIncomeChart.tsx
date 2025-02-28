import { Bar } from "react-chartjs-2";

interface HouseholdIncomeChartProps {
  distribution: {
    range: string;
    count: number;
  }[];
}

export default function HouseholdIncomeChart({
  distribution,
}: HouseholdIncomeChartProps) {
  const data = {
    labels: distribution.map((d) => d.range),
    datasets: [
      {
        label: "Number of Households",
        data: distribution.map((d) => d.count),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
