"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiEye, FiEdit2, FiTrash2, FiSearch, FiX, FiDroplet, FiSun, FiTag } from "react-icons/fi";
import { LuLeaf, LuSprout } from "react-icons/lu";

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

export default function MyPlantsPage() {
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
        manage: "false",
        page: currentPage.toString(),
        limit: "9",
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
      toast.error("Failed to load your plants");
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
    router.push(`/dashboard/edit-plant/${id}`);
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Indoor":
        return "🏠";
      case "Outdoor":
        return "🌳";
      case "Flower":
        return "🌸";
      case "Succulent":
        return "🌵";
      case "Herb":
        return "🌿";
      case "Tree":
        return "🌲";
      default:
        return "🌱";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg shadow-green-700/20">
              <LuSprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Plants</h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalPlants} {totalPlants === 1 ? "plant" : "plants"} in your garden
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/add-plant")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-700/30 hover:shadow-green-700/40"
          >
            <LuLeaf className="w-5 h-5" />
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
                  placeholder="Search your plants..."
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
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-w-[180px]"
              >
                <option value="">All Categories</option>
                <option value="Indoor">🏠 Indoor</option>
                <option value="Outdoor">🌳 Outdoor</option>
                <option value="Flower">🌸 Flower</option>
                <option value="Succulent">🌵 Succulent</option>
                <option value="Herb">🌿 Herb</option>
                <option value="Tree">🌲 Tree</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-green-700/20 border-t-green-700 rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading your plants...</p>
              </div>
            </div>
          ) : plants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mb-6">
                <LuSprout className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No plants yet</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                {search || category
                  ? "Try adjusting your search or filter criteria"
                  : "Start your green journey by adding your first plant"}
              </p>
              {(search || category) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setCurrentPage(1);
                  }}
                  className="text-green-700 hover:text-green-800 font-medium"
                >
                  Clear filters
                </button>
              )}
              {!search && !category && (
                <button
                  onClick={() => router.push("/dashboard/add-plant")}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-700/30"
                >
                  Add Your First Plant
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {plants.map((plant) => (
                  <div
                    key={plant._id}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {plant.image ? (
                        <img
                          src={plant.image}
                          alt={plant.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50">
                          <LuLeaf className="w-16 h-16 text-green-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={() => handleView(plant)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all shadow-lg"
                        >
                          <FiEye className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleEdit(plant._id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all shadow-lg"
                        >
                          <FiEdit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(plant._id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all shadow-lg"
                        >
                          <FiTrash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-lg">
                          {getCategoryIcon(plant.category)} {plant.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                        {plant.title}
                      </h3>
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(plant.difficulty)}`}>
                          {plant.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <FiDroplet className="w-3 h-3" />
                          {plant.watering}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {plant.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
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
                    <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium">
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
            </>
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
                    className="w-full h-72 object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedPlant.title}</h3>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {getCategoryIcon(selectedPlant.category)} {selectedPlant.category}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm border ${getDifficultyColor(selectedPlant.difficulty)}`}>
                      {selectedPlant.difficulty}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Watering</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center gap-2">
                    <FiDroplet className="w-5 h-5 text-blue-500" />
                    {selectedPlant.watering}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
                  <p className="text-gray-700 mt-2 leading-relaxed">{selectedPlant.description}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEdit(selectedPlant._id);
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                >
                  Edit Plant
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
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