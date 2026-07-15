"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { LuImage, LuX, LuLeaf, LuArrowLeft } from "react-icons/lu";
import { FiLoader } from "react-icons/fi";

const IMAGEBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

type PlantForm = {
  title: string;
  category: string;
  difficulty: string;
  watering: string;
  image: string;
  description: string;
};

export default function EditPlant() {
  const router = useRouter();
  const params = useParams();
  const plantId = params?.id as string;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [originalImage, setOriginalImage] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<PlantForm>({
    defaultValues: {
      title: "",
      category: "",
      difficulty: "",
      watering: "",
      image: "",
      description: "",
    },
  });

  useEffect(() => {
    if (plantId) {
      fetchPlantData();
    }
  }, [plantId]);

  const fetchPlantData = async () => {
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
      const response = await fetch(`${apiUrl}/api/plants/${plantId}`, {
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
        throw new Error("Failed to fetch plant data");
      }

      const data = await response.json();
      const plantData = data.plant || data;

      setValue("title", plantData.title || "");
      setValue("category", plantData.category || "");
      setValue("difficulty", plantData.difficulty || "");
      setValue("watering", plantData.watering || "");
      setValue("image", plantData.image || "");
      setValue("description", plantData.description || "");

      if (plantData.image) {
        setImagePreview(plantData.image);
        setOriginalImage(plantData.image);
      }
    } catch (error) {
      console.error("Error fetching plant:", error);
      toast.error("Failed to load plant data");
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToImageBB = async (file: File) => {
    if (!IMAGEBB_API_KEY) {
      toast.error("ImgBB API Key is missing in environment variables!");
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
        setValue("image", imageUrl);
        clearErrors("image");
        toast.success("Image updated successfully!");
        return imageUrl;
      } else {
        throw new Error(data.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    await uploadImageToImageBB(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFileName("");
    setValue("image", "");
    clearErrors("image");
  };

  const onSubmit = async (data: PlantForm) => {
    if (!data.image) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      if (!token) {
        toast.error("Authentication failed. Please login again.");
        setIsSubmitting(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const endpoint = `${apiUrl}/api/plants/${plantId}`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.status === 403) {
        toast.error("Authentication failed. Please login again.");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status ${response.status}`);
      }

      toast.success("Plant updated successfully! 🎉");
      router.push("/dashboard/manage-plant");
    } catch (error) {
      console.error("Error updating plant:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Cannot connect to server. Please make sure the backend is running.");
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to update plant. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-green-700/20 border-t-green-700 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading plant data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/dashboard/manage-plant")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
        >
          <LuArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Plants</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-green-700 to-green-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <LuLeaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Plant</h1>
                <p className="text-green-100 text-sm mt-0.5">Update your plant information</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 tracking-wide">
                  PLANT NAME
                </label>
                <input
                  type="text"
                  placeholder="Enter plant name"
                  {...register("title", { required: "Plant name is required" })}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 tracking-wide">
                  CATEGORY
                </label>
                <select
                  {...register("category", { required: "Please select a category" })}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none ${
                    errors.category ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">Select Category</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Flower">Flower</option>
                  <option value="Succulent">Succulent</option>
                  <option value="Herb">Herb</option>
                  <option value="Tree">Tree</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 tracking-wide">
                  DIFFICULTY LEVEL
                </label>
                <select
                  {...register("difficulty", { required: "Please select difficulty level" })}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none ${
                    errors.difficulty ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 tracking-wide">
                  WATERING FREQUENCY
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly, Daily, Bi-weekly"
                  {...register("watering", { required: "Watering frequency is required" })}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.watering ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                  }`}
                />
                {errors.watering && (
                  <p className="text-red-500 text-sm mt-1">{errors.watering.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 tracking-wide">
                DESCRIPTION
              </label>
              <textarea
                {...register("description", { required: "Description is required" })}
                placeholder="Describe your plant (care tips, characteristics, etc.)"
                rows={5}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none ${
                  errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 tracking-wide">
                PLANT IMAGE
              </label>

              {!imagePreview ? (
                <div className="relative">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                        <LuImage className="w-7 h-7 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <p className="text-sm font-medium text-gray-700">
                          {fileName || "Choose File"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Max: 5MB • JPEG, PNG, GIF, WEBP
                        </p>
                      </label>
                    </div>
                    {isUploading && (
                      <div className="flex items-center gap-2">
                        <FiLoader className="w-5 h-5 animate-spin text-green-600" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Plant preview"
                      className="w-full h-56 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <LuX className="w-5 h-5" />
                    </button>
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-lg">
                          <FiLoader className="w-6 h-6 animate-spin text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Uploading...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Click the ✕ button to remove and re-upload
                  </p>
                </div>
              )}
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="w-5 h-5 animate-spin" />
                    {isUploading ? "Uploading Image..." : "Updating Plant..."}
                  </span>
                ) : (
                  "Update Plant"
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/manage-plant")}
                className="px-8 py-3.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}