"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LuLayoutDashboard, 
  LuList, 
  LuMenu, 
  LuX, 
  LuSprout, 
  LuUser,
  LuLeaf,
  LuLogOut,
  LuPlus
} from "react-icons/lu";
import { FaHome, FaPlus } from "react-icons/fa";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { BiHome } from "react-icons/bi";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LuLayoutDashboard },
  { name: "Add Plant", href: "/dashboard/add-plant", icon: FaPlus },
  { name: "My Plants", href: "/dashboard/my-plants", icon: LuSprout },
  { name: "Manage Plants", href: "/dashboard/manage-plant", icon: LuList },
  { name: "Profile", href: "/dashboard/profile", icon: LuUser },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Close sidebar on route change on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const getPageTitle = () => {
    const path = pathname.split("/").pop() || "dashboard";
    const titles: Record<string, string> = {
      "dashboard": "Overview",
      "add-plant": "Add New Plant",
      "my-plants": "My Plant Collection",
      "manage-plant": "Manage Plants",
      "profile": "Profile Settings",
    };
    return titles[path] || path.replace("-", " ");
  };

  // Show loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-700/20 border-t-green-700 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-2xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-green-700 rounded-xl shadow-lg shadow-green-700/20">
                <LuLeaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                PlantCare
              </span>
            </Link>
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <LuX size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-700 to-green-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-green-700/20">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-4 space-y-1 overflow-y-auto flex-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  isActive 
                    ? "bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg shadow-green-700/20" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <Icon 
                  size={20} 
                  className={`transition-transform duration-200 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  }`} 
                />
                <span className="flex-1">{link.name}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 mt-auto">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
          >
            <BiHome size={20} className="text-gray-400 group-hover:text-gray-600" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group mt-1"
          >
            <LuLogOut size={20} className="text-red-400 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <LuMenu size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 capitalize">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Welcome back, {user?.name || "User"}! 👋
              </p>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {pathname !== "/dashboard/add-plant" && (
              <Link
                href="/dashboard/add-plant"
                className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-green-700/20 hover:shadow-green-700/30"
              >
                <LuPlus size={18} />
                <span className="hidden sm:inline">Add Plant</span>
              </Link>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-700 to-green-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-green-700/20">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}