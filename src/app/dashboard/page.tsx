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

const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#8b5cf6", "#ef4444", "#06b6d4", "#f472b6"];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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

      const [statsResponse, plantsResponse] = await Promise.all([
        fetch(`${apiUrl}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/api/plants?manage=false&limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsResponse.status === 403 || plantsResponse.status === 403) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      let userStats = null;
      let userPlants = [];

      if (statsResponse.ok) {
        const data = await statsResponse.json();
        userStats = data;
        setStats(userStats);
      }

      if (plantsResponse.ok) {
        const data = await plantsResponse.json();
        userPlants = data.plants || [];
        setPlants(userPlants);
      }

      if (!userStats || userStats.totalPlants === 0) {
        setStats({
          totalPlants: 0,
          stats: [],
        });
        setPlants([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats({
        totalPlants: 0,
        stats: [],
      });
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month, index) => {
      const count = plants.filter((plant) => {
        const date = new Date(plant.createdAt);
        return date.getMonth() === index && date.getFullYear() === new Date().getFullYear();
      }).length;
      return { name: month, plants: count };
    });
  };

  const getCategoryData = () => {
    if (!stats?.stats || stats.stats.length === 0) {
      return [{ name: "No Data", value: 1 }];
    }
    return stats.stats.map((item) => ({
      name: item._id,
      value: item.count,
    }));
  };

  const getRecentActivity = () => {
    if (plants.length === 0) return [];
    return plants
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((plant) => ({
        id: plant._id,
        action: `Added ${plant.title}`,
        time: getTimeAgo(new Date(plant.createdAt)),
        type: "add",
      }));
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(days / 365);
    return `${years} years ago`;
  };

  const getMonthlyRevenue = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month, index) => {
      const count = plants.filter((plant) => {
        const date = new Date(plant.createdAt);
        return date.getMonth() === index && date.getFullYear() === new Date().getFullYear();
      }).length;
      return { name: month, revenue: count * 50 };
    });
  };

  const totalPlants = stats?.totalPlants || 0;
  const totalCategories = stats?.stats?.length || 0;
  const growthRate = plants.length > 0 ? `+${Math.round((plants.length / 12) * 100)}%` : "0%";
  const healthScore = plants.length > 0 ? `${Math.min(100, 85 + Math.round((plants.length / 100) * 15))}%` : "85%";

  const statsData = [
    {
      label: "Total Plants",
      value: totalPlants,
      color: "text-green-700",
      bg: "bg-green-50",
      icon: FaLeaf,
      border: "border-green-200",
    },
    {
      label: "Categories",
      value: totalCategories,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: FiPackage,
      border: "border-blue-200",
    },
    {
      label: "Growth Rate",
      value: growthRate,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      icon: FiTrendingUp,
      border: "border-yellow-200",
    },
    {
      label: "Health Score",
      value: healthScore,
      color: "text-purple-600",
      bg: "bg-purple-50",
      icon: FiHeart,
      border: "border-purple-200",
    },
  ];

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();
  const revenueData = getMonthlyRevenue();
  const recentActivity = getRecentActivity();

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-48 md:h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-48 md:h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8 px-3 md:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm md:text-base mt-1">
              Welcome back! You have {totalPlants} {totalPlants === 1 ? "plant" : "plants"} in your collection.
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white rounded-xl shadow-sm border flex-1 sm:flex-none">
              <FiCalendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs md:text-sm text-gray-600">Today</span>
            </div>
            <button
              onClick={() => router.push("/dashboard/add-plant")}
              className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-700/30 text-sm md:text-base whitespace-nowrap"
            >
              + Add Plant
            </button>
          </div>
        </div>

        {totalPlants === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLeaf className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">No Plants Yet</h3>
            <p className="text-gray-500 text-sm md:text-base mb-6">Start your green journey by adding your first plant!</p>
            <button
              onClick={() => router.push("/dashboard/add-plant")}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-700/30"
            >
              Add Your First Plant
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border ${stat.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <p className="text-gray-500 font-medium text-xs md:text-sm">{stat.label}</p>
                    <div className={`p-1.5 md:p-2 ${stat.bg} rounded-lg md:rounded-xl`}>
                      <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className={`text-xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <div className="mt-2 md:mt-3 h-1 w-8 md:w-12 bg-gradient-to-r from-green-500 to-green-700 rounded-full"></div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Plant Growth</h3>
                    <p className="text-xs md:text-sm text-gray-500">Monthly plant additions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Plants</span>
                  </div>
                </div>
                <div className="h-48 sm:h-56 md:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorPlants" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                      <YAxis stroke="#9ca3af" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="plants"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fill="url(#colorPlants)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Revenue</h3>
                    <p className="text-xs md:text-sm text-gray-500">Monthly revenue ($)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Revenue</span>
                  </div>
                </div>
                <div className="h-48 sm:h-56 md:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                      <YAxis stroke="#9ca3af" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border hover:shadow-lg transition-all lg:col-span-1">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Category Distribution</h3>
                <div className="h-48 sm:h-56 md:h-64">
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
                        outerRadius={60}
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
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-3 md:mt-4">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border hover:shadow-lg transition-all lg:col-span-2">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800">Recent Activity</h3>
                  <button
                    onClick={() => router.push("/explore")}
                    className="text-xs md:text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2 md:space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="p-1.5 md:p-2 rounded-lg bg-green-100">
                            <FaLeaf className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-medium text-gray-800">{activity.action}</p>
                            <p className="text-[10px] md:text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                        <span className="text-[10px] md:text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 self-start sm:self-center">
                          ADDED
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 md:py-8 text-gray-500">
                      <p className="text-sm md:text-base">No recent activity</p>
                      <p className="text-xs md:text-sm mt-1">Start adding plants to see activity here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}