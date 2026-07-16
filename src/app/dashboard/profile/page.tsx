// app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  FaEnvelope,
  FaCheckCircle,
  FaLeaf,
  FaUsers,
  FaHeart,
  FaSeedling,
  FaCamera,
} from "react-icons/fa";
import { FiEdit2, FiSave, FiX, FiDroplet, FiTrendingUp } from "react-icons/fi";

const IMAGEBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

type UserProfile = {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;
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
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [plantStats, setPlantStats] = useState<PlantStats>({
    total: 0,
    categories: 0,
    cared: 0,
    watering: 0,
    growth: "+0%",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchPlantStats();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data: session } = await authClient.getSession();
      
      if (session?.user) {
        const userData = {
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          image: session.user.image || "",
          emailVerified: session.user.emailVerified || false,
        };
        setUser(userData);
        setFormData({
          name: userData.name,
        });
        if (userData.image) {
          setImagePreview(userData.image);
        }
      } else {
        toast.error("Please login first");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const total = data.totalPlants || 0;
        const categories = data.stats?.length || 0;
        setPlantStats({
          total: total,
          categories: categories,
          cared: Math.floor(total * 0.85),
          watering: Math.floor(total * 0.7),
          growth: total > 0 ? `+${Math.round((total / 12) * 100)}%` : "+0%",
        });
      }
    } catch (error) {
      console.error("Error fetching plant stats:", error);
    }
  };

  const uploadImageToImageBB = async (file: File) => {
    if (!IMAGEBB_API_KEY) {
      toast.error("ImgBB API Key is missing!");
      return null;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url;
        setImagePreview(imageUrl);
        toast.success("Image uploaded successfully!");
        return imageUrl;
      } else {
        throw new Error(data.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let imageUrl = user?.image || "";

      if (imageFile) {
        const uploadedUrl = await uploadImageToImageBB(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setIsSaving(false);
          return;
        }
      }

      const { error } = await authClient.updateUser(
        {
          name: formData.name,
          image: imageUrl,
        },
        {
          onSuccess: () => {
            setUser({
              ...user!,
              name: formData.name,
              image: imageUrl,
            });
            toast.success("Profile updated successfully! 🌿");
            setIsEditing(false);
            setIsSaving(false);
          },
          onError: (ctx) => {
            toast.error(ctx?.error?.message || "Failed to update profile");
            setIsSaving(false);
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
      setIsSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({ name: user?.name || "" });
      setImagePreview(user?.image || null);
      setImageFile(null);
    }
    setIsEditing(!isEditing);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50/30 to-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Not Logged In</h2>
          <p className="text-gray-500 mb-4">Please login to view your profile</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[50dvh] flex items-center justify-center bg-gradient-to-br from-green-50/30 to-gray-50 ">
      <div className="w-[380px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        {/* TOP DESIGN */}
        <div className="h-28 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 relative">

          <div className="absolute top-3 right-3 flex gap-2">
            </div>

          {/* Profile Avatar */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 rounded-full ring-4 ring-white overflow-hidden bg-white shadow-lg relative group">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={user.name || "User"}
                  width={80}
                  height={80}
                  className="object-cover rounded-full"
                  unoptimized={imagePreview.includes("googleusercontent.com")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 text-white font-bold text-2xl">
                  {getInitials(user?.name || "User")}
                </div>
              )}
              {isEditing && (
                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaCamera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="pt-14 px-6 pb-6 text-center">

          {/* Name & Edit Button */}
          <div className="flex items-center justify-center gap-3">
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-xl font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-48"
                placeholder="Your name"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800">{user?.name || "User"}</h2>
            )}
            <button
              onClick={handleEditToggle}
              className="text-green-600 hover:text-green-700 transition-colors"
              title="Edit Profile"
            >
              {isEditing ? <FiX className="w-4 h-4" /> : <FiEdit2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Email - Disabled */}
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
            <FaEnvelope className="text-green-500" />
            {user?.email || "No email"}
          </p>

          {/* Verification Badge */}
          {user?.emailVerified ? (
            <span className="inline-flex items-center gap-1 mt-3 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              <FaCheckCircle /> Verified Account
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 mt-3 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
              <FaCheckCircle /> Pending Verification
            </span>
          )}

          {/* Save Button - Only shows when editing */}
          {isEditing && (
            <div className="mt-4">
              <button
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSaving || isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isUploading ? "Uploading Image..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              {isUploading && (
                <p className="text-xs text-gray-500 mt-1">Uploading image...</p>
              )}
            </div>
          )}

      


        </div>
      </div>
    </div>
  );
}