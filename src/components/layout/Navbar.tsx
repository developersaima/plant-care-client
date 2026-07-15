"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LuSprout } from "react-icons/lu"; 

const links = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        
        {/* Logo with Icon */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-green-700">
          <LuSprout className="text-3xl" /> 
          <span>PlantCare</span>
        </Link>

        {/* Desktop Main Menu (Middle) */}
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

        {/* Right Side (Auth / User) */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-black">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200 overflow-hidden">
                {session.user.image ? (
                  <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span>{session.user.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button onClick={() => signOut()} className="text-sm text-red-500 hover:underline">Logout</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-green-700 font-medium">Login</Link>
              <Link href="/register" className="bg-green-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-2xl text-green-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white p-5 flex flex-col gap-4 border-t shadow-lg">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block text-gray-700">
              {link.name}
            </Link>
          ))}
          <hr />
          {session ? (
            <div className="flex flex-col gap-2">
              <p className="font-bold">{session.user.name}</p>
              <button onClick={() => signOut()} className="text-red-500 text-left">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
              <Link href="/register" className="text-green-700 font-bold" onClick={() => setIsOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}