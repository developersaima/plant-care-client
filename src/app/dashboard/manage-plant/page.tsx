"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiEye, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";

type Plant = {
  _id: string;
  title: string;
  category: string;
  difficulty: string;
  watering: string;
  image: string;
  description: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export default function ManagePlantsPage() {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlants, setTotalPlants] = useState(0);

  useEffect(() => {
    fetchPlants();
  }, [search, category, currentPage]);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      if (!token) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const queryParams = new URLSearchParams({
        manage: "true",
        page: currentPage.toString(),
        limit: "10",
      });
      
      if (search) queryParams.append("search", search);
      if (category) queryParams.append("category", category);

      const response = await fetch(`${apiUrl}/api/plants?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch plants");
      }

      const data = await response.json();
      setPlants(data.plants || []);
      setTotalPages(data.pages || 1);
      setTotalPlants(data.total || 0);
    } catch (error) {
      console.error("Error fetching plants:", error);
      toast.error("Failed to load plants");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/plants/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete plant");
      }

      toast.success("Plant deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      fetchPlants();
    } catch (error) {
      console.error("Error deleting plant:", error);
      toast.error("Failed to delete plant");
    }
  };

  const handleView = (plant: Plant) => {
    setSelectedPlant(plant);
    setIsViewModalOpen(true);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/manage-plant/edit/${id}`);
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-700 rounded-xl shadow-lg shadow-green-700/20">
              <LuLeaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Plants</h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalPlants} {totalPlants === 1 ? "plant" : "plants"} in your collection
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/add-plant")}
            className="flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-700/30 hover:shadow-green-700/40"
          >
            <FiPlus className="w-5 h-5" />
            Add New Plant
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">All Categories</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Flower">Flower</option>
                <option value="Succulent">Succulent</option>
                <option value="Herb">Herb</option>
                <option value="Tree">Tree</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-green-700/20 border-t-green-700 rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading plants...</p>
              </div>
            </div>
          ) : plants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <LuLeaf className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No plants found</h3>
              <p className="text-gray-500 text-center max-w-md">
                {search || category
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first plant to the collection"}
              </p>
              {(search || category) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setCurrentPage(1);
                  }}
                  className="mt-4 text-green-700 hover:text-green-800 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-700 to-green-800">
                    <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
                      Plant
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
                      Watering
                    </th>
                    <th className="px-6 py-4 text-center text-white font-semibold text-sm uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {plants.map((plant, index) => (
                    <tr
                      key={plant._id}
                      className="hover:bg-green-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {plant.image ? (
                            <img
                              src={plant.image}
                              alt={plant.title}
                              className="w-10 h-10 rounded-lg object-cover ring-2 ring-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ring-2 ring-gray-200">
                              <LuLeaf className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium text-gray-800">{plant.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {plant.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            plant.difficulty === "Easy"
                              ? "bg-green-100 text-green-700"
                              : plant.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {plant.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{plant.watering}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(plant)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all group-hover:scale-110"
                            title="View"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(plant._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all group-hover:scale-110"
                            title="Edit"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(plant._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all group-hover:scale-110"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && plants.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {plants.length} of {totalPlants} plants
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-green-700 text-white rounded-lg font-medium">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isViewModalOpen && selectedPlant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Plant Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <FiX className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {selectedPlant.image && (
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={selectedPlant.image}
                    alt={selectedPlant.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Plant Name</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{selectedPlant.title}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{selectedPlant.category}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{selectedPlant.difficulty}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Watering</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{selectedPlant.watering}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
                <p className="text-gray-700 mt-2 leading-relaxed">{selectedPlant.description}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-full px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Plant</h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to delete this plant? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteId(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}