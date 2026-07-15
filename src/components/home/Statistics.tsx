// components/home/Statistics.tsx
"use client";

import { FaHeart } from "react-icons/fa";
import { FiUsers, FiHeart } from "react-icons/fi";

export default function Statistics() {
  const stats = [
    {
      label: "Plant Care",
      value: "🌱",
      description: "Learn & Grow",
      icon: FaHeart,
      color: "text-green-700",
    },
    {
      label: "Community",
      value: "🤝",
      description: "Share & Connect",
      icon: FiUsers,
      color: "text-blue-600",
    },
    {
      label: "Passion",
      value: "❤️",
      description: "Love for Plants",
      icon: FaHeart,
      color: "text-rose-600",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center gap-4"
              >
                <div className="p-3 bg-gray-50 rounded-xl">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}