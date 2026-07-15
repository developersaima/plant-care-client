// components/home/FeaturedPlants.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlantCard from "../shared/PlantCard";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";

type Plant = {
  _id?: string;
  id?: string;
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

export default function FeaturedPlants() {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPlants();
  }, []);

  const fetchFeaturedPlants = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/plants?limit=4`);

      if (!response.ok) {
        throw new Error("Failed to fetch plants");
      }

      const data = await response.json();
      const featuredPlants = (data.plants || []).slice(0, 4);
      setPlants(featuredPlants);
    } catch (error) {
      console.error("Error fetching featured plants:", error);
      const staticPlants = [
        {
          _id: "1",
          id: "1",
          title: "Snake Plant",
          category: "Indoor",
          difficulty: "Easy",
          watering: "Weekly",
          image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600",
          description: "A hardy plant that thrives on neglect",
          email: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "2",
          id: "2",
          title: "Peace Lily",
          category: "Flower",
          difficulty: "Medium",
          watering: "Weekly",
          image: "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=600",
          description: "Beautiful white flowers and easy to care for",
          email: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "3",
          id: "3",
          title: "Aloe Vera",
          category: "Medicinal",
          difficulty: "Easy",
          watering: "Bi-weekly",
          image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600",
          description: "Known for its healing properties",
          email: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "4",
          id: "4",
          title: "Cactus",
          category: "Succulent",
          difficulty: "Hard",
          watering: "Monthly",
          image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600",
          description: "Perfect for dry climates and low maintenance",
          email: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setPlants(staticPlants.slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="text-center mb-12">
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-green-700 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl animate-pulse">
              <div className="h-56 bg-gray-200 rounded-t-xl"></div>
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-center mb-3 text-green-600">
          Featured Plants
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Discover some popular plants for your home and garden.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plants.map((plant) => (
          <PlantCard key={plant._id || plant.id} plant={plant} />
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => router.push("/explore")}
          className="inline-flex items-center gap-2 px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >
          View All Plants
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}