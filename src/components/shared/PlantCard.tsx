// components/shared/PlantCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";

type Plant = {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  difficulty: string;
  watering: string;
  image: string;
  description: string;
};

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const router = useRouter();

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

  const handleView = () => {
    const id = plant._id || plant.id;
    if (id) {
      router.push(`/explore/${id}`);
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
            onClick={handleView}
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
          onClick={handleView}
          className="mt-4 w-full py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all"
        >
          View Details
        </button>
      </div>
    </div>
  );
}