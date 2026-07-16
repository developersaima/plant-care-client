"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaLeaf } from "react-icons/fa";
import { LuSprout, LuLayoutDashboard, LuLogOut, LuUser } from "react-icons/lu";

const links = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, refetch } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      await refetch();
      setIsDropdownOpen(false);
      setIsOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-green-700">
          <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg shadow-green-700/20">
            <FaLeaf className="w-4 h-4 text-white" />
          </div>
          PlantCare
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${pathname === link.href ? "font-bold text-green-700" : "text-gray-600 hover:text-green-700"}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200 overflow-hidden cursor-pointer hover:ring-2 ring-green-500 transition"
              >
                {session.user.image ? (
                  <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span>{session.user.name?.charAt(0).toUpperCase()}</span>
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl p-4 flex flex-col gap-3">
                  <div className="border-b pb-2 flex items-center gap-2">
                    <LuUser className="text-gray-400" />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-black truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                  </div>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsDropdownOpen(false)} 
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-700"
                  >
                    <LuLayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 text-sm text-left text-red-600 font-medium hover:text-red-700"
                  >
                    <LuLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            !isAuthPage && (
              <>
                <Link href="/login" className="text-green-700 font-medium">Login</Link>
                <Link href="/register" className="bg-green-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition">Register</Link>
              </>
            )
          )}
        </div>

        <button className="md:hidden text-2xl text-green-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white p-5 flex flex-col gap-4 border-t shadow-lg">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block text-gray-700">
              {link.name}
            </Link>
          ))}
          <hr />
          {session ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <LuUser className="text-gray-400" />
                <div>
                  <p className="font-bold text-sm">{session.user.name}</p>
                  <p className="text-xs text-gray-500">{session.user.email}</p>
                </div>
              </div>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-green-700 font-bold">
                <LuLayoutDashboard size={18} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 text-left font-medium">
                <LuLogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            !isAuthPage && (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setIsOpen(false)} className="font-medium">Login</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="text-green-700 font-bold">Register</Link>
              </div>
            )
          )}
        </div>
      )}
    </nav>
  );
}