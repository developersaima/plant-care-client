// app/error.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiRefreshCw, FiHome, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";


interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center animate-pulse">
              <FiAlertTriangle className="w-16 h-16 text-red-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-white font-bold text-lg">!</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Something Went Wrong!
          </h1>
          <p className="text-xl text-gray-500 mb-2">
            We encountered an unexpected error
          </p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700">Error Details:</p>
                <p className="text-sm text-red-600 break-all">
                  {error.message || "An unexpected error occurred"}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-500 mt-1">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/40"
            >
              <FiRefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
            >
              <FiHome className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center mb-4">
            You can also try:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center gap-1"
            >
              <FiArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <span className="text-gray-300">•</span>
            <a
              href="/explore"
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Explore Plants
            </a>
            <span className="text-gray-300">•</span>
            <a
              href="/contact"
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Reload Hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            If the problem persists, please refresh the page or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}