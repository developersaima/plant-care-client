// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="relative inline-block">
          <div className="w-20 h-20 border-4 border-green-200 rounded-full animate-spin">
            <div className="absolute inset-0 border-t-4 border-green-600 rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-green-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mt-8 space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">Loading...</h2>
          <p className="text-gray-500">Please wait while we prepare your plants</p>
          
          {/* Loading Dots */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>

        {/* Decorative Leaves */}
        <div className="absolute top-1/4 left-1/4 opacity-10">
          <div className="w-24 h-24 bg-green-500 rounded-full blur-2xl"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-10">
          <div className="w-32 h-32 bg-emerald-500 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}