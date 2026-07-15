"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiSearch, FiFilter, FiX, FiEye } from "react-icons/fi";
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

export default function ExplorePage() {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("-1");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlants, setTotalPlants] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchPlants();
  }, [search, category, sort, currentPage]);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "9",
        sort: sort,
      });
      
      if (search) queryParams.append("search", search);
      if (category) queryParams.append("category", category);

      const response = await fetch(`${apiUrl}/api/plants?${queryParams}`);

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

  const handleViewPlant = (id: string) => {
    router.push(`/explore/${id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg shadow-green-700/20">
              <LuLeaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Explore Plants</h1>
          <p className="text-gray-500">Discover and learn about different plants</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search plants by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <FiFilter className="w-5 h-5" />
            Filters
            {category && (
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm min-w-[160px]"
          >
            <option value="-1">Newest First</option>
            <option value="1">Oldest First</option>
          </select>
        </div>

        {isFilterOpen && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-all"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            {category && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-green-700 hover:text-green-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-green-700/20 border-t-green-700 rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading plants...</p>
            </div>
          </div>
        ) : plants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mb-6">
              <LuLeaf className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No plants found</h3>
            <p className="text-gray-500 text-center max-w-md">
              {search || category
                ? "Try adjusting your search or filter criteria"
                : "No plants available at the moment"}
            </p>
            {(search || category) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-green-700 hover:text-green-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleViewPlant(plant._id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all shadow-lg"
                      >
                        <FiEye className="w-4 h-4 text-gray-700" />
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                        {plant.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        💧 {plant.watering}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {plant.description}
                    </p>
                    <button
                      onClick={() => handleViewPlant(plant._id)}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-700/30"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}