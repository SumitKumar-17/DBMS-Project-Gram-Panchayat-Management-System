import { useState, useEffect } from "react";
import { Citizen, HouseholdWithMembers } from "@/types/models";
import axios from "axios";
import AddHousehold from "./AddHousehold";
import AddCitizenToHousehold from "./AddCitizenToHousehold";
import AddExistingCitizen from "./AddExistingCitizen";

interface HouseholdManagerProps {
  onUpdate: () => void;
}

export default function HouseholdManager({ onUpdate }: HouseholdManagerProps) {
  const [households, setHouseholds] = useState<HouseholdWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    address: "",
    income: "",
  });

  useEffect(() => {
    fetchAllHouseholds();
  }, []);

  const fetchAllHouseholds = async () => {
    try {
      const response = await axios.get("/api/households");
      setHouseholds(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching households:", error);
    }
  };

  const handleSubmit = async (householdId: number) => {
    try {
      await axios.patch(`/api/households/${householdId}`, {
        address: editForm.address,
        income: parseFloat(editForm.income),
      });
      setIsEditing(null);
      fetchAllHouseholds();
      onUpdate();
    } catch (error) {
      console.error("Error updating household:", error);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading households...</div>;
  }

  return (
    <div className="space-y-6">
      <AddHousehold onSuccess={fetchAllHouseholds} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {households.map((household) => (
          <div
            key={household.household_id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Household #{household.household_id}
                </h3>
                <button
                  onClick={() => {
                    if (isEditing === household.household_id) {
                      setIsEditing(null);
                    } else {
                      setIsEditing(household.household_id);
                      setEditForm({
                        address: household.address,
                        income: household.income.toString(),
                      });
                    }
                  }}
                  className="text-white hover:text-blue-100"
                >
                  {isEditing === household.household_id ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            <div className="p-6">
              {isEditing === household.household_id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(household.household_id);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Annual Income
                    </label>
                    <input
                      type="number"
                      value={editForm.income}
                      onChange={(e) =>
                        setEditForm({ ...editForm, income: e.target.value })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <p className="text-gray-600">{household.address}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-600 font-medium">
                        ₹{household.income.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-500">
                        Family Members ({household.citizens.length})
                      </h4>
                      <div className="flex items-center">
                        <AddCitizenToHousehold
                          householdId={household.household_id}
                          onSuccess={fetchAllHouseholds}
                        />
                        <AddExistingCitizen
                          householdId={household.household_id}
                          onSuccess={fetchAllHouseholds}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {household.citizens.map((member) => (
                        <div
                          key={member.citizen_id}
                          className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.gender} •{" "}
                              {new Date(member.dob).toLocaleDateString()} •{" "}
                              {member.educational_qualification}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
