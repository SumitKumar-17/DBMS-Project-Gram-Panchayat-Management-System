import { useState, useEffect } from "react";
import axios from "axios";
import { Citizen } from "@/types/models";

interface AddExistingCitizenProps {
  householdId: number;
  onSuccess: () => void;
}

export default function AddExistingCitizen({
  householdId,
  onSuccess,
}: AddExistingCitizenProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [availableCitizens, setAvailableCitizens] = useState<Citizen[]>([]);
  const [selectedCitizenId, setSelectedCitizenId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchOtherHouseholdCitizens();
    }
  }, [isOpen, householdId]);

  const fetchOtherHouseholdCitizens = async () => {
    try {
      // Get citizens from other households
      const response = await axios.get(
        `/api/citizens/other-households/${householdId}`
      );
      setAvailableCitizens(response.data);
    } catch (error) {
      console.error("Error fetching citizens from other households:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/citizens/${selectedCitizenId}/transfer`, {
        new_household_id: householdId,
      });
      setSelectedCitizenId("");
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error transferring citizen:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="text-purple-600 hover:text-purple-700 text-sm font-medium ml-4"
      >
        + Transfer Citizen
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Transfer Citizen from Another Household
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            {loading ? (
              <div className="py-4 text-center">
                Loading citizens from other households...
              </div>
            ) : availableCitizens.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                No citizens found in other households
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Citizen to Transfer
                  </label>
                  <select
                    value={selectedCitizenId}
                    onChange={(e) => setSelectedCitizenId(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select a citizen</option>
                    {availableCitizens.map((citizen) => (
                      <option
                        key={citizen.citizen_id}
                        value={citizen.citizen_id}
                      >
                        {citizen.name} - Household #{citizen.household_id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    disabled={!selectedCitizenId}
                  >
                    Transfer to This Household
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
