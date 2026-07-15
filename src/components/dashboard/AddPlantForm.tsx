// components/dashboard/AddPlantForm.tsx
"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { LuImage, LuX } from "react-icons/lu";
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

export default function AddPlantForm() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  // Get token on component mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await authClient.token();
        console.log("Token response:", response);
        if (response?.data?.token) {
          setToken(response.data.token);
          console.log("Token obtained successfully");
        } else {
          console.error("No token in response:", response);
        }
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };
    getToken();
  }, []);

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
        toast.success("Image uploaded successfully!");
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
      // Get fresh token
      let currentToken = token;
      if (!currentToken) {
        const tokenResponse = await authClient.token();
        console.log("Fresh token response:", tokenResponse);
        if (tokenResponse?.data?.token) {
          currentToken = tokenResponse.data.token;
          setToken(currentToken);
        } else {
          toast.error("Authentication failed. Please login again.");
          setIsSubmitting(false);
          return;
        }
      }

      console.log("Using token:", currentToken.substring(0, 20) + "...");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const endpoint = `${apiUrl}/api/plants`;
      
      console.log("Sending request to:", endpoint);
      console.log("Data being sent:", data);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentToken}`,
        },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);

      if (response.status === 403) {
        toast.error("Authentication failed. Please login again.");
        // Redirect to login page
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("Plant added successfully:", result);
      
      toast.success("Plant added successfully! 🎉");
      reset();
      setImagePreview(null);
      setFileName("");
      router.push("/dashboard/my-plants");
    } catch (error) {
      console.error("Error adding plant:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Cannot connect to server. Please make sure the backend is running on port 5000.");
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to add plant. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          {/* Plant Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 tracking-wide">
              PLANT NAME
            </label>
            <input
              type="text"
              placeholder="Enter plant name"
              {...register("title", { required: "Plant name is required" })}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-200"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 tracking-wide">
              CATEGORY
            </label>
            <select
              {...register("category", { required: "Please select a category" })}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none ${
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

          {/* Difficulty Level */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 tracking-wide">
              DIFFICULTY LEVEL
            </label>
            <select
              {...register("difficulty", { required: "Please select difficulty level" })}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none ${
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

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 tracking-wide">
              DESCRIPTION
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              placeholder="Describe your plant (care tips, characteristics, etc.)"
              rows={5}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none ${
                errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-200"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 tracking-wide">
              PLANT IMAGE
            </label>
            
            {!imagePreview ? (
              <div className="relative">
                <div className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <LuImage className="w-6 h-6 text-gray-400" />
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
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                  <img 
                    src={imagePreview} 
                    alt="Plant preview" 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <LuX className="w-4 h-4" />
                  </button>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg">
                        <FiLoader className="w-5 h-5 animate-spin text-green-600" />
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

          {/* Watering Frequency */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 tracking-wide">
              WATERING FREQUENCY
            </label>
            <input
              type="text"
              placeholder="e.g. Weekly, Daily, Bi-weekly"
              {...register("watering", { required: "Watering frequency is required" })}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.watering ? "border-red-500 focus:ring-red-500" : "border-gray-200"
              }`}
            />
            {errors.watering && (
              <p className="text-red-500 text-sm mt-1">{errors.watering.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting || isUploading || !token}
          >
            {isSubmitting || isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <FiLoader className="w-5 h-5 animate-spin" />
                {isUploading ? "Uploading Image..." : "Adding Plant..."}
              </span>
            ) : (
              "Add Plant"
            )}
          </button>
          {!token && (
            <p className="text-xs text-amber-600 text-center mt-2">
              ⚠️ Authenticating... Please wait.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}