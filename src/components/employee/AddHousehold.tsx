import { useState } from "react";
import axios from "axios";

interface AddHouseholdProps {
  onSuccess: () => void;
}

export default function AddHousehold({ onSuccess }: AddHouseholdProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    income: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/households", {
        address: formData.address,
        income: parseFloat(formData.income),
      });
      setFormData({ address: "", income: "" });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating household:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
      >
        Add New Household
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Household
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
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
                  value={formData.income}
                  onChange={(e) =>
                    setFormData({ ...formData, income: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Household
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
