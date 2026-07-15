// components/dashboard/AddPlantForm.tsx
"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { LuUpload, LuLeaf, LuDroplet, LuSun, LuTag, LuAlignLeft, LuImage } from "react-icons/lu";
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    await uploadImageToImageBB(file);
  };

  const onSubmit = async (data: PlantForm) => {
    if (!data.image) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: tokenData } = await authClient.token();

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/plants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Plant added successfully! 🎉");
        reset();
        setImagePreview(null);
        router.push("/my-plants");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add plant.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200/40 via-base-100 to-base-200/20 py-12 px-4 md:px-8 text-base-content">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <LuLeaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content tracking-tight">
              Add New Plant
            </h1>
            <p className="text-base-content/60 text-sm mt-0.5">
              Fill in the details to add a new plant to your collection.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300/60 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            {/* Plant Name & Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plant Name */}
              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                    <LuLeaf className="w-3.5 h-3.5 text-primary" />
                    Plant Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter plant name"
                  {...register("title", { required: "Plant name is required" })}
                  className={`input input-bordered w-full bg-base-200/40 focus:bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all ${
                    errors.title ? "border-error focus:border-error focus:ring-error" : ""
                  }`}
                />
                {errors.title && (
                  <span className="text-error text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-error"></span>
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* Image Upload */}
              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                    <LuImage className="w-3.5 h-3.5 text-primary" />
                    Plant Image
                  </span>
                </label>
                <div className="flex items-center gap-4 bg-base-200/30 p-3 rounded-xl border border-dashed border-base-300">
                  <div className="avatar">
                    <div className={`w-14 h-14 rounded-xl ring-2 ${imagePreview ? "ring-primary/30" : "ring-base-300"} flex items-center justify-center bg-base-200 overflow-hidden`}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <LuUpload className="w-5 h-5 text-base-content/40" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="file-input file-input-bordered w-full file-input-sm bg-base-100 border-base-300 rounded-lg text-base-content file:bg-base-200 file:text-base-content file:border-0"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 rounded-lg">
                          <FiLoader className="w-5 h-5 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                    <input type="hidden" {...register("image", { required: "Image is required" })} />
                    <p className="text-[11px] text-base-content/40 mt-1">
                      Max: 5MB • JPEG, PNG, GIF, WEBP
                    </p>
                  </div>
                </div>
                {errors.image && (
                  <span className="text-error text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-error"></span>
                    {errors.image.message}
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                  <LuTag className="w-3.5 h-3.5 text-primary" />
                  Category
                </span>
              </label>
              <select
                {...register("category", { required: "Please select a category" })}
                className={`select select-bordered w-full bg-base-200/40 focus:bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all ${
                  errors.category ? "border-error" : ""
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
                <span className="text-error text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-error"></span>
                  {errors.category.message}
                </span>
              )}
            </div>

            {/* Difficulty & Watering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                    <LuSun className="w-3.5 h-3.5 text-primary" />
                    Difficulty Level
                  </span>
                </label>
                <select
                  {...register("difficulty", { required: "Please select difficulty level" })}
                  className={`select select-bordered w-full bg-base-200/40 focus:bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all ${
                    errors.difficulty ? "border-error" : ""
                  }`}
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <span className="text-error text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-error"></span>
                    {errors.difficulty.message}
                  </span>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                    <LuDroplet className="w-3.5 h-3.5 text-primary" />
                    Watering Frequency
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly, Daily, Bi-weekly"
                  {...register("watering", { required: "Watering frequency is required" })}
                  className={`input input-bordered w-full bg-base-200/40 focus:bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all ${
                    errors.watering ? "border-error" : ""
                  }`}
                />
                {errors.watering && (
                  <span className="text-error text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-error"></span>
                    {errors.watering.message}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                  <LuAlignLeft className="w-3.5 h-3.5 text-primary" />
                  Description
                </span>
              </label>
              <textarea
                {...register("description", { required: "Description is required" })}
                placeholder="Describe your plant (care tips, characteristics, etc.)"
                rows={5}
                className={`textarea textarea-bordered w-full bg-base-200/40 focus:bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all ${
                  errors.description ? "border-error" : ""
                }`}
              />
              {errors.description && (
                <span className="text-error text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-error"></span>
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-base-200">
              <button
                type="submit"
                className="btn btn-primary text-white w-full rounded-xl shadow-md shadow-primary/20 font-semibold transition-all duration-200 normal-case"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-white"></span>
                    <span className="text-white">{isUploading ? "Uploading Image..." : "Adding Plant..."}</span>
                  </>
                ) : (
                  <>
                    <LuLeaf className="w-4 h-4 text-white" />
                    Add Plant
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}