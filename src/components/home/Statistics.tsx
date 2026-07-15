// components/home/Statistics.tsx
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {  FiUsers, FiClock, FiCheckCircle } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

type StatsData = {
  totalPlants: number;
  stats: Array<{
    _id: string;
    count: number;
  }>;
};

export default function Statistics() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      if (!token) {
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default stats if API fails
      setStats({
        totalPlants: 1250,
        stats: [
          { _id: "Indoor", count: 450 },
          { _id: "Outdoor", count: 300 },
          { _id: "Flower", count: 250 },
          { _id: "Succulent", count: 250 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      label: "Total Plants",
      value: stats?.totalPlants?.toLocaleString() || "1,250",
      color: "text-green-700",
      icon: FaLeaf,
      bg: "bg-green-50",
    },
    {
      label: "Categories",
      value: stats?.stats?.length?.toString() || "4",
      color: "text-blue-600",
      icon: FiUsers,
      bg: "bg-blue-50",
    },
    {
      label: "Growing Plants",
      value: stats?.totalPlants ? Math.floor(stats.totalPlants * 0.75).toLocaleString() : "938",
      color: "text-yellow-600",
      icon: FiClock,
      bg: "bg-yellow-50",
    },
    {
      label: "Success Rate",
      value: stats?.totalPlants ? `${Math.floor((stats.totalPlants / 1500) * 100)}%` : "98%",
      color: "text-purple-600",
      icon: FiCheckCircle,
      bg: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-green-700 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
             Platform Statistics
          </h2>
          
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className={`p-2 ${stat.bg} rounded-xl`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <h3 className={`text-4xl font-extrabold ${stat.color}`}>
                {stat.value}
              </h3>
              <div className="mt-4 h-1 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
            </div>
          ))}
        </div>

        {stats?.stats && stats.stats.length > 0 && (
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.stats.map((category, index) => (
                <div key={index} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-600">{category._id}</span>
                  <span className="text-lg font-bold text-green-700">{category.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}