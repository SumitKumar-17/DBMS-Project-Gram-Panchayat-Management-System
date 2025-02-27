interface StatsSummaryProps {
  totalCitizens: number;
  totalVaccinations: number;
  totalLand: number;
  totalEnrollments: number;
}

export default function StatsSummaryCards({
  totalCitizens,
  totalVaccinations,
  totalLand,
  totalEnrollments,
}: StatsSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Population Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-indigo-600">Total Citizens</p>
          <p className="text-2xl font-bold">{totalCitizens}</p>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg">
          <p className="text-sm text-pink-600">Total Vaccinations</p>
          <p className="text-2xl font-bold">{totalVaccinations}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">Total Land (Acres)</p>
          <p className="text-2xl font-bold">{totalLand}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">Scheme Enrollments</p>
          <p className="text-2xl font-bold">{totalEnrollments}</p>
        </div>
      </div>
    </div>
  );
}
