// app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import { FaLeaf } from "react-icons/fa";
import { FiHome, FiArrowLeft, FiSearch } from "react-icons/fi";

import { LuSprout } from "react-icons/lu";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Decorative Leaf */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center animate-pulse">
              <LuSprout className="w-16 h-16 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">404</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-500 mb-2">
            Looks like this plant has gone missing
          </p>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto mb-8">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for plants..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    router.push(`/explore?search=${encodeURIComponent(target.value)}`);
                  }
                }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
            >
              <FiArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-700/30 hover:shadow-green-700/40"
            >
              <FiHome className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center mb-4">
            Or visit these sections:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/explore"
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors flex items-center gap-1"
            >
              <FaLeaf className="w-4 h-4" />
              Explore Plants
            </a>
            <span className="text-gray-300">•</span>
            <a
              href="/dashboard/my-plants"
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors flex items-center gap-1"
            >
              My Plants
            </a>
            <span className="text-gray-300">•</span>
            <a
              href="/dashboard/add-plant"
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors flex items-center gap-1"
            >
              Add Plant
            </a>
            <span className="text-gray-300">•</span>
            <a
              href="/about"
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors flex items-center gap-1"
            >
              About Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}