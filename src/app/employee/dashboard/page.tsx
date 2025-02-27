"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Citizen } from "@/types/models";

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "citizens" | "vaccinations" | "land" | "schemes"
  >("citizens");
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [newVaccination, setNewVaccination] = useState({
    citizen_id: "",
    vaccine_type: "",
    date_administered: "",
  });

  const [newLandRecord, setNewLandRecord] = useState({
    citizen_id: "",
    area_acres: "",
    crop_type: "",
  });

  const [newSchemeEnrollment, setNewSchemeEnrollment] = useState({
    citizen_id: "",
    scheme_id: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const citizensRes = await axios.get<Citizen[]>("/api/citizens");
      setCitizens(citizensRes.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVaccination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/vaccinations", newVaccination);
      setNewVaccination({
        citizen_id: "",
        vaccine_type: "",
        date_administered: "",
      });
      loadData();
    } catch (error) {
      console.error(error);
      setError("Failed to add vaccination record");
    }
  };

  const handleAddLandRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/land-records", newLandRecord);
      setNewLandRecord({
        citizen_id: "",
        area_acres: "",
        crop_type: "",
      });
      loadData();
    } catch (error) {
      console.error(error);
      setError("Failed to add land record");
    }
  };

  const handleAddSchemeEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newSchemeEnrollment.citizen_id || !newSchemeEnrollment.scheme_id) {
        console.error("Citizen ID and Scheme ID must not be empty");
        return;
      }
      const response = await axios.post("/api/scheme-enrollments", newSchemeEnrollment);
      if(response.data.code===0){

      setNewSchemeEnrollment({
        citizen_id: "",
        scheme_id: "",
      });
      loadData();
      }
      else {
        console.error("Scheme enrollment failed");
        setError("Failed to add scheme enrollment");

      }
    } catch (error) {
      console.error(error);
      setError("Failed to add scheme enrollment");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Employee Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["citizens", "vaccinations", "land", "schemes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === "citizens" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Citizens List</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DOB
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Education
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {citizens.map((citizen) => (
                      <tr key={citizen.citizen_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {citizen.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {citizen.gender}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(citizen.dob).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {citizen.educational_qualification}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "vaccinations" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Add Vaccination Record
              </h2>
              <form onSubmit={handleAddVaccination} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Citizen
                  </label>
                  <select
                    value={newVaccination.citizen_id}
                    onChange={(e) =>
                      setNewVaccination({
                        ...newVaccination,
                        citizen_id: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Citizen</option>
                    {citizens.map((citizen) => (
                      <option
                        key={citizen.citizen_id}
                        value={citizen.citizen_id}
                      >
                        {citizen.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vaccine Type
                  </label>
                  <input
                    type="text"
                    value={newVaccination.vaccine_type}
                    onChange={(e) =>
                      setNewVaccination({
                        ...newVaccination,
                        vaccine_type: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date Administered
                  </label>
                  <input
                    type="date"
                    value={newVaccination.date_administered}
                    onChange={(e) =>
                      setNewVaccination({
                        ...newVaccination,
                        date_administered: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add Vaccination Record
                </button>
              </form>
            </div>
          )}

          {activeTab === "land" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Add Land Record</h2>
              <form onSubmit={handleAddLandRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Citizen
                  </label>
                  <select
                    value={newLandRecord.citizen_id}
                    onChange={(e) =>
                      setNewLandRecord({
                        ...newLandRecord,
                        citizen_id: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Citizen</option>
                    {citizens.map((citizen) => (
                      <option
                        key={citizen.citizen_id}
                        value={citizen.citizen_id}
                      >
                        {citizen.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newLandRecord.area_acres}
                    onChange={(e) =>
                      setNewLandRecord({
                        ...newLandRecord,
                        area_acres: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Crop Type
                  </label>
                  <input
                    type="text"
                    value={newLandRecord.crop_type}
                    onChange={(e) =>
                      setNewLandRecord({
                        ...newLandRecord,
                        crop_type: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add Record
                </button>
              </form>
            </div>
          )}

          {activeTab === "schemes" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Add Scheme Enrollment
              </h2>
              <form onSubmit={handleAddSchemeEnrollment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Citizen
                  </label>
                  <select
                    value={newSchemeEnrollment.citizen_id}
                    onChange={(e) =>
                      setNewSchemeEnrollment({
                        ...newSchemeEnrollment,
                        citizen_id: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Citizen</option>
                    {citizens.map((citizen) => (
                      <option
                        key={citizen.citizen_id}
                        value={citizen.citizen_id}
                      >
                        {citizen.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Scheme
                  </label>
                  <select
                    value={newSchemeEnrollment.scheme_id}
                    onChange={(e) =>
                      setNewSchemeEnrollment({
                        ...newSchemeEnrollment,
                        scheme_id: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Scheme</option>
                    <option value="31">Scheme 1</option>
                    <option value="32">Scheme 2</option>
                    <option value="33">Scheme 3</option>

                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add Enrollment
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
