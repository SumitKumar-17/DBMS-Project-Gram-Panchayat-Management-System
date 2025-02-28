"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Citizen } from "@/types/models";
import HouseholdManager from "@/components/employee/HouseholdManager";
import AssetManager from "@/components/employee/AssetManager";

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "citizens" | "vaccinations" | "land" | "schemes" | "households" | "assets"
  >("citizens");
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    if (user?.id) {
      loadData();
    }
  }, [user]);

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
      const response = await axios.post(
        "/api/scheme-enrollments",
        newSchemeEnrollment
      );
      if (response.data.code === 0) {
        setNewSchemeEnrollment({
          citizen_id: "",
          scheme_id: "",
        });
        loadData();
      } else {
        console.error(response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to add scheme enrollment");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Employee Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm">
            {[
              "citizens",
              "vaccinations",
              "land",
              "schemes",
              "households",
              "assets",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`${
                  activeTab === tab
                    ? "bg-indigo-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                } px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === "citizens" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Citizens List
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Name", "Gender", "DOB", "Education"].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {citizens.map((citizen) => (
                      <tr
                        key={citizen.citizen_id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {citizen.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {citizen.gender}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(citizen.dob).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Add Vaccination Record
              </h2>
              <form
                onSubmit={handleAddVaccination}
                className="max-w-2xl space-y-6"
              >
                <FormField
                  label="Citizen"
                  type="select"
                  value={newVaccination.citizen_id}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      citizen_id: e.target.value,
                    })
                  }
                  options={citizens.map((c) => ({
                    value: String(c.citizen_id),
                    label: c.name,
                  }))}
                />
                <FormField
                  label="Vaccine Type"
                  type="text"
                  value={newVaccination.vaccine_type}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      vaccine_type: e.target.value,
                    })
                  }
                />
                <FormField
                  label="Date Administered"
                  type="date"
                  value={newVaccination.date_administered}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      date_administered: e.target.value,
                    })
                  }
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Add Vaccination Record
                </button>
              </form>
            </div>
          )}

          {activeTab === "land" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Add Land Record
              </h2>
              <form
                onSubmit={handleAddLandRecord}
                className="max-w-2xl space-y-6"
              >
                <FormField
                  label="Citizen"
                  type="select"
                  value={newLandRecord.citizen_id}
                  onChange={(e) =>
                    setNewLandRecord({
                      ...newLandRecord,
                      citizen_id: e.target.value,
                    })
                  }
                  options={citizens.map((c) => ({
                    value: String(c.citizen_id),
                    label: c.name,
                  }))}
                />
                <FormField
                  label="Area (Acres)"
                  type="number"
                  value={newLandRecord.area_acres}
                  onChange={(e) =>
                    setNewLandRecord({
                      ...newLandRecord,
                      area_acres: e.target.value,
                    })
                  }
                />
                <FormField
                  label="Crop Type"
                  type="text"
                  value={newLandRecord.crop_type}
                  onChange={(e) =>
                    setNewLandRecord({
                      ...newLandRecord,
                      crop_type: e.target.value,
                    })
                  }
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Add Land Record
                </button>
              </form>
            </div>
          )}

          {activeTab === "schemes" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Add Scheme Enrollment
              </h2>
              <form
                onSubmit={handleAddSchemeEnrollment}
                className="max-w-2xl space-y-6"
              >
                <FormField
                  label="Citizen"
                  type="select"
                  value={newSchemeEnrollment.citizen_id}
                  onChange={(e) =>
                    setNewSchemeEnrollment({
                      ...newSchemeEnrollment,
                      citizen_id: e.target.value,
                    })
                  }
                  options={citizens.map((c) => ({
                    value: String(c.citizen_id),
                    label: c.name,
                  }))}
                />
                <FormField
                  label="Scheme"
                  type="select"
                  value={newSchemeEnrollment.scheme_id}
                  onChange={(e) =>
                    setNewSchemeEnrollment({
                      ...newSchemeEnrollment,
                      scheme_id: e.target.value,
                    })
                  }
                  options={[
                    { value: "31", label: "Scheme 1" },
                    { value: "32", label: "Scheme 2" },
                    { value: "33", label: "Scheme 3" },
                  ]}
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Add Enrollment
                </button>
              </form>
            </div>
          )}

          {activeTab === "households" && (
            <div>
              <h2 className="text-xl text-black font-semibold mb-6 text-gray-900">
                Household Management
              </h2>
              <HouseholdManager onUpdate={loadData} />
            </div>
          )}

          {activeTab === "assets" && (
            <div>
              <h2 className="text-xl  text-black font-semibold mb-6 text-gray-900">
                Asset Management
              </h2>
              <AssetManager onUpdate={loadData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  type,
  value,
  onChange,
  options = [],
}: {
  label: string;
  type: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options?: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {type === "select" ? (
        <select
          value={value}
          onChange={onChange}
          className="mt-1 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
          required
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full  text-black rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
          required
        />
      )}
    </div>
  );
}
