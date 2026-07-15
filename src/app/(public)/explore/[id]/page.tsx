"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiDroplet, FiSun, FiTag, FiCalendar } from "react-icons/fi";
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

export default function PlantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const plantId = params?.id as string;
  
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("🔍 PlantDetailPage rendered with ID:", plantId);

  useEffect(() => {
    if (plantId) {
      fetchPlantDetails();
    }
  }, [plantId]);

  const fetchPlantDetails = async () => {
    setLoading(true);
    try {
      console.log("1️⃣ Fetching plant details...");
      console.log("2️⃣ Plant ID:", plantId);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const endpoint = `${apiUrl}/api/plants/${plantId}`;
      console.log("3️⃣ Fetching from:", endpoint);

      const response = await fetch(endpoint);

      console.log("4️⃣ Response status:", response.status);

      if (response.status === 404) {
        toast.error("Plant not found");
        router.push("/explore");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch plant details");
      }

      const data = await response.json();
      console.log("5️⃣ Plant data received:", data);
      setPlant(data);
    } catch (error) {
      console.error("❌ Error fetching plant:", error);
      toast.error("Failed to load plant details");
    } finally {
      setLoading(false);
    }
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

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "😊";
      case "Medium":
        return "🤔";
      case "Hard":
        return "😅";
      default:
        return "🌱";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-green-700/20 border-t-green-700 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading plant details...</p>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LuLeaf className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Plant not found</h2>
          <p className="text-gray-500 mb-6">The plant you're looking for doesn't exist or has been removed</p>
          <button
            onClick={() => router.push("/explore")}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-700/30"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/explore")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md"
        >
          <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Explore</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {plant.image && (
            <div className="relative h-[400px] overflow-hidden bg-gray-100">
              <img
                src={plant.image}
                alt={plant.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 text-green-200 text-sm font-medium mb-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>Added {formatDate(plant.createdAt)}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  {plant.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/30">
                    {getCategoryIcon(plant.category)} {plant.category}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium border backdrop-blur-sm ${getDifficultyColor(plant.difficulty)}`}>
                    {getDifficultyEmoji(plant.difficulty)} {plant.difficulty}
                  </span>
                  <span className="px-4 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-blue-400/30">
                    💧 {plant.watering}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            {!plant.image && (
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">{plant.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {getCategoryIcon(plant.category)} {plant.category}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getDifficultyColor(plant.difficulty)}`}>
                    {getDifficultyEmoji(plant.difficulty)} {plant.difficulty}
                  </span>
                  <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    💧 {plant.watering}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <FiTag className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Category</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {getCategoryIcon(plant.category)} {plant.category}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-100">
                <div className="flex items-center gap-2 text-yellow-700 mb-1">
                  <FiSun className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Difficulty</span>
                </div>
                <p className={`text-xl font-semibold ${plant.difficulty === "Easy" ? "text-green-700" : plant.difficulty === "Medium" ? "text-yellow-700" : "text-red-700"}`}>
                  {getDifficultyEmoji(plant.difficulty)} {plant.difficulty}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <FiDroplet className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Watering</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">{plant.watering}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-gradient-to-b from-green-600 to-green-700 rounded-full"></span>
                About this plant
              </h2>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200">
                <p className="text-gray-700 leading-relaxed text-lg">{plant.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => router.push("/explore")}
                className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Explore More Plants
              </button>
              <button
                onClick={() => router.push("/dashboard/my-plants")}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-700/30 hover:shadow-green-700/40"
              >
                View My Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}