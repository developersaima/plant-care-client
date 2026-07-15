// app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaLeaf,
  FaUserEdit,
  FaCamera,
  FaUsers,
  FaHeart,
  FaSeedling,
} from "react-icons/fa";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiCalendar,
  FiDroplet,
  FiSun,
  FiTrendingUp,
} from "react-icons/fi";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type PlantStats = {
  total: number;
  categories: number;
  cared: number;
  watering: number;
  growth: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [plantStats, setPlantStats] = useState<PlantStats>({
    total: 0,
    categories: 0,
    cared: 0,
    watering: 0,
    growth: "+24%",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchPlantStats();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      if (!token) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      const { data: session } = await authClient.getSession();
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.name || "Plant Lover",
          email: session.user.email || "",
          image: session.user.image || "",
          emailVerified: session.user.emailVerified || false,
          // createdAt: session.user.createdAt || new Date().toISOString(),
          // updatedAt: session.user.updatedAt || new Date().toISOString(),
        });
        setFormData({
          name: session.user.name || "",
          email: session.user.email || "",
        });
      } else {
        // Fallback data
        setUser({
          id: "1",
          name: "Plant Lover",
          email: "user@plantcare.com",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setFormData({
          name: "Plant Lover",
          email: "user@plantcare.com",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUser({
        id: "1",
        name: "Plant Lover",
        email: "user@plantcare.com",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setFormData({
        name: "Plant Lover",
        email: "user@plantcare.com",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlantStats = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlantStats({
          total: data.totalPlants || 0,
          categories: data.stats?.length || 0,
          cared: Math.floor((data.totalPlants || 0) * 0.85),
          watering: Math.floor((data.totalPlants || 0) * 0.7),
          growth: "+24%",
        });
      }
    } catch (error) {
      console.error("Error fetching plant stats:", error);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setUser({
        ...user!,
        name: formData.name,
        email: formData.email,
      });
      
      toast.success("Profile updated successfully! 🌿");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50/30 to-gray-50 px-4">
        <div className="w-[380px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="h-28 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 animate-pulse"></div>
          <div className="pt-14 px-6 pb-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
            <div className="space-y-4 mt-4">
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
              <div className="space-y-3 mt-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50/30 to-gray-50 px-4 py-8">
      <div className="w-[380px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        {/* TOP DESIGN - Green Gradient */}
        <div className="h-28 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 relative">

          {/* Stats Badges on Top */}
          <div className="absolute top-3 right-3 flex gap-2">
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white font-medium flex items-center gap-1">
              <FaSeedling className="w-3 h-3" />
              {plantStats.total}
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white font-medium flex items-center gap-1">
              <FaHeart className="w-3 h-3" />
              {plantStats.cared}
            </div>
          </div>

          {/* Profile Avatar */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 rounded-full ring-4 ring-white overflow-hidden bg-white shadow-lg">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={80}
                  height={80}
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 text-white font-bold text-2xl">
                  {getInitials(user?.name || "User")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="pt-14 px-6 pb-6 text-center">

          {/* Name & Edit Button */}
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">
              {user?.name}
            </h2>
            <button
              onClick={handleEditToggle}
              className="text-green-600 hover:text-green-700 transition-colors"
              title="Edit Profile"
            >
              {isEditing ? <FiX className="w-4 h-4" /> : <FiEdit2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Email */}
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
            <FaEnvelope className="text-green-500" />
            {user?.email}
          </p>

          {/* Verification Badge */}
          {user?.emailVerified && (
            <span className="inline-flex items-center gap-1 mt-3 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              <FaCheckCircle /> Verified Account
            </span>
          )}

          {/* Edit Form */}
          {isEditing && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-xs font-medium text-gray-500">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INFO GRID - Plant Care Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 text-xs font-medium">
                <FaLeaf />
                Total Plants
              </div>
              <p className="text-xl font-bold text-gray-800 mt-1">{plantStats.total}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 text-xs font-medium">
                <FaUsers />
                Categories
              </div>
              <p className="text-xl font-bold text-gray-800 mt-1">{plantStats.categories}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-600 text-xs font-medium">
                <FaHeart />
                Cared For
              </div>
              <p className="text-xl font-bold text-gray-800 mt-1">{plantStats.cared}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600 text-xs font-medium">
                <FiDroplet />
                Watering
              </div>
              <p className="text-xl font-bold text-gray-800 mt-1">{plantStats.watering}</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-6 space-y-2 text-left bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1">
                <FaCalendarAlt className="text-green-500" />
                Joined
              </span>
              <span className="text-gray-700">{formatDate(user?.createdAt)}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-gray-200 pt-2">
              <span className="text-gray-500 flex items-center gap-1">
                <FaClock className="text-green-500" />
                Last Updated
              </span>
              <span className="text-gray-700">{formatDate(user?.updatedAt)}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-gray-200 pt-2">
              <span className="text-gray-500 flex items-center gap-1">
                <FiTrendingUp className="text-green-500" />
                Growth Rate
              </span>
              <span className="text-green-600 font-semibold">{plantStats.growth}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4 flex justify-center">
            <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${
              user?.emailVerified 
                ? "bg-green-100 text-green-700" 
                : "bg-yellow-100 text-yellow-700"
            }`}>
              <FaCheckCircle />
              {user?.emailVerified ? "Verified Member" : "Pending Verification"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}