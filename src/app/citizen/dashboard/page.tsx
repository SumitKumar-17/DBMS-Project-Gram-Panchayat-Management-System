"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { CitizenDetails } from "@/types/models";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [citizenData, setCitizenData] = useState<CitizenDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCitizenData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCitizenData = async () => {
    try {
      const response = await axios.get<CitizenDetails>(
        `/api/citizens/${user?.id}`,
      );
      setCitizenData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load citizen data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!citizenData) return <div>No data found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Citizen Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-3">
            <p>
              <span className="font-medium">Name:</span> {citizenData.name}
            </p>
            <p>
              <span className="font-medium">Gender:</span> {citizenData.gender}
            </p>
            <p>
              <span className="font-medium">Date of Birth:</span>{" "}
              {new Date(citizenData.dob).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Education:</span>{" "}
              {citizenData.educational_qualification}
            </p>
            <p>
              <span className="font-medium">Household ID:</span>{" "}
              {citizenData.household_id}
            </p>
          </div>
        </div>

        {/* Vaccination History */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Vaccination History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Vaccine
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {citizenData.vaccinations.map((vac) => (
                  <tr key={vac.vaccination_id}>
                    <td className="px-4 py-2">{vac.vaccine_type}</td>
                    <td className="px-4 py-2">
                      {new Date(vac.date_administered).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Land Records */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Land Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Area (Acres)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Crop Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {citizenData.land_records.map((record) => (
                  <tr key={record.land_id}>
                    <td className="px-4 py-2">{record.area_acres}</td>
                    <td className="px-4 py-2">{record.crop_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheme Enrollments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Enrolled Schemes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Scheme
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Enrolled Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {citizenData.scheme_enrollments.map((enrollment) => (
                  <tr key={enrollment.enrollment_id}>
                    <td className="px-4 py-2">
                      {enrollment.welfare_schemes.name}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(
                        enrollment.enrollment_date,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
