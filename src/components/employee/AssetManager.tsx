import { useState, useEffect } from "react";
import { Asset } from "@/types/models";
import axios from "axios";

interface AssetManagerProps {
  onUpdate: () => void;
}

export default function AssetManager({ onUpdate }: AssetManagerProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    type: "",
    location: "",
  });

  const [newAsset, setNewAsset] = useState({
    type: "",
    location: "",
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await axios.get("/api/assets");
      setAssets(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/assets", newAsset);
      setNewAsset({
        type: "",
        location: "",
      });
      fetchAssets();
      onUpdate();
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  const handleUpdate = async (assetId: number) => {
    try {
      await axios.post("/api/assets", {
        asset_id: assetId,
        ...editForm,
      });
      setIsEditing(null);
      fetchAssets();
      onUpdate();
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading assets...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Add New Asset Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Asset
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <input
                type="text"
                value={newAsset.type}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, type: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={newAsset.location}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, location: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Add Asset
          </button>
        </form>
      </div>

      {/* Assets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.asset_id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Asset #{asset.asset_id}
                </h3>
                <button
                  onClick={() => {
                    if (isEditing === asset.asset_id) {
                      setIsEditing(null);
                    } else {
                      setIsEditing(asset.asset_id);
                      setEditForm({
                        type: asset.type,
                        location: asset.location,
                      });
                    }
                  }}
                  className="text-white hover:text-purple-100"
                >
                  {isEditing === asset.asset_id ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            <div className="p-6">
              {isEditing === asset.asset_id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate(asset.asset_id);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <input
                        type="text"
                        value={editForm.type}
                        onChange={(e) =>
                          setEditForm({ ...editForm, type: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm({ ...editForm, location: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="text-base font-medium text-gray-900">
                        {asset.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-base font-medium text-gray-900">
                        {asset.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Installation Date</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(asset.installation_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
