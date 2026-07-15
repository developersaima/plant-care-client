// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiTrendingUp,
  FiHeart,
  FiCalendar,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaLeaf } from "react-icons/fa";

type StatsData = {
  totalPlants: number;
  stats: Array<{
    _id: string;
    count: number;
  }>;
};

const monthlyData = [
  { name: "Jan", plants: 12, revenue: 450 },
  { name: "Feb", plants: 19, revenue: 680 },
  { name: "Mar", plants: 15, revenue: 520 },
  { name: "Apr", plants: 25, revenue: 890 },
  { name: "May", plants: 32, revenue: 1200 },
  { name: "Jun", plants: 28, revenue: 980 },
  { name: "Jul", plants: 35, revenue: 1450 },
  { name: "Aug", plants: 42, revenue: 1680 },
  { name: "Sep", plants: 38, revenue: 1520 },
  { name: "Oct", plants: 45, revenue: 1850 },
  { name: "Nov", plants: 52, revenue: 2100 },
  { name: "Dec", plants: 58, revenue: 2450 },
];

const categoryData = [
  { name: "Indoor", value: 35 },
  { name: "Outdoor", value: 25 },
  { name: "Flower", value: 20 },
  { name: "Succulent", value: 15 },
  { name: "Herb", value: 5 },
];

const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#8b5cf6", "#ef4444"];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity] = useState([
    { id: 1, action: "Added Snake Plant", time: "2 hours ago", type: "add" },
    { id: 2, action: "Watered Peace Lily", time: "5 hours ago", type: "water" },
    { id: 3, action: "Updated Aloe Vera", time: "1 day ago", type: "update" },
    { id: 4, action: "Removed Dead Leaves", time: "2 days ago", type: "remove" },
    { id: 5, action: "Added Cactus", time: "3 days ago", type: "add" },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
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
      const response = await fetch(`${apiUrl}/api/dashboard/stats`, {
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
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalPlants: 150,
        stats: [
          { _id: "Indoor", count: 45 },
          { _id: "Outdoor", count: 35 },
          { _id: "Flower", count: 30 },
          { _id: "Succulent", count: 25 },
          { _id: "Herb", count: 15 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      label: "Total Plants",
      value: stats?.totalPlants || 0,
      color: "text-green-700",
      bg: "bg-green-50",
      icon: FaLeaf,
      border: "border-green-200",
    },
    {
      label: "Categories",
      value: stats?.stats?.length || 0,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: FiPackage,
      border: "border-blue-200",
    },
    {
      label: "Growth Rate",
      value: "+24%",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      icon: FiTrendingUp,
      border: "border-yellow-200",
    },
    {
      label: "Health Score",
      value: "98%",
      color: "text-purple-600",
      bg: "bg-purple-50",
      icon: FiHeart,
      border: "border-purple-200",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your plants.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border">
              <FiCalendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <button
              onClick={() => router.push("/dashboard/add-plant")}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-700/30"
            >
              + Add Plant
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-2xl shadow-sm border ${stat.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 font-medium text-sm">{stat.label}</p>
                <div className={`p-2 ${stat.bg} rounded-xl`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <div className="mt-3 h-1 w-12 bg-gradient-to-r from-green-500 to-green-700 rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Plant Growth</h3>
                <p className="text-sm text-gray-500">Monthly plant additions</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Plants</span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorPlants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="plants"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fill="url(#colorPlants)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
                <p className="text-sm text-gray-500">Monthly revenue ($)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Revenue</span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition-all lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => {
                      const percentage = percent ? (percent * 100).toFixed(0) : "0";
                      return `${name} ${percentage}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition-all lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === "add" ? "bg-green-100" :
                      activity.type === "water" ? "bg-blue-100" :
                      activity.type === "update" ? "bg-yellow-100" :
                      "bg-red-100"
                    }`}>
                      <FaLeaf className={`w-4 h-4 ${
                        activity.type === "add" ? "text-green-600" :
                        activity.type === "water" ? "text-blue-600" :
                        activity.type === "update" ? "text-yellow-600" :
                        "text-red-600"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.type === "add" ? "bg-green-100 text-green-700" :
                      activity.type === "water" ? "bg-blue-100 text-blue-700" :
                      activity.type === "update" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {activity.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}