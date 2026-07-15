"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLayoutDashboard, LuList, LuMenu, LuX, LuSprout, LuUser } from "react-icons/lu";
import { FaHome, FaPlus } from "react-icons/fa";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LuLayoutDashboard },
  { name: "Add Plant", href: "/dashboard/add-plant", icon: FaPlus },
  { name: "Manage Plants", href: "/dashboard/manage-plant", icon: LuList },
  { name: "My Plants", href: "/dashboard/my-plants", icon: LuSprout },
  { name: "Profile", href: "/dashboard/profile", icon: LuUser },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-700">PlantCare</Link>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <LuX size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                  pathname === link.href ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            );
          })}
          <hr className="my-4" />
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaHome size={20} /> Back to Home
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
            <LuMenu size={24} />
          </button>
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
          </h2>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}