"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { CitizenDetails } from "@/types/models";

export default function CitizenDashboard() {
  const { user,logout } = useAuth();
  const [citizenData, setCitizenData] = useState<CitizenDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadCitizenData();
    }
  }, [user]);

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600">Error: {error}</p>
      </div>
    </div>
  );

  if (!citizenData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-yellow-600">No data found</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-2 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            Citizen Dashboard
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="bg-indigo-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Personal Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <InfoRow label="Name" value={citizenData.name} />
              <InfoRow label="Gender" value={citizenData.gender} />
              <InfoRow 
                label="Date of Birth" 
                value={new Date(citizenData.dob).toLocaleDateString()} 
              />
              <InfoRow 
                label="Education" 
                value={citizenData.educational_qualification} 
              />
              <InfoRow 
                label="Household ID" 
                value={citizenData.household_id} 
              />
            </div>
          </div>

          {/* Vaccination History Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="bg-green-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Vaccination History</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vaccine
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {citizenData.vaccinations.map((vac) => (
                      <tr key={vac.vaccination_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {vac.vaccine_type}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {new Date(vac.date_administered).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Land Records Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="bg-amber-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Land Records</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area (Acres)
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crop Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {citizenData.land_records.map((record) => (
                      <tr key={record.land_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {record.area_acres}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {record.crop_type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Scheme Enrollments Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="bg-purple-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Enrolled Schemes</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scheme
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrolled Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {citizenData.scheme_enrollments.map((enrollment) => (
                      <tr key={enrollment.enrollment_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {enrollment.welfare_schemes.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {new Date(enrollment.enrollment_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for Personal Information rows
function InfoRow({ label, value }: { label: string; value: string|number }) {
  return (
    <div className="flex items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500 w-1/3">{label}:</span>
      <span className="text-sm text-gray-900 flex-1">{value}</span>
    </div>
  );
}
