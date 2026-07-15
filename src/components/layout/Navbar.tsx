"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-2xl font-bold text-green-700">
          PlantCare
        </Link>

        {/* Mobile Menu Button - Hamburger Icon */}
        <button 
          className="md:hidden text-2xl text-green-700 p-2" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${pathname === link.href ? "font-semibold text-green-700" : "text-gray-700 hover:text-green-700"}`}
            >
              {link.name}
            </Link>
          ))}
          
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-green-700 font-bold">Dashboard</Link>
              <button onClick={() => signOut()} className="text-red-600 font-medium">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="bg-green-700 text-white px-4 py-2 rounded-lg font-medium">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile Menu - White background */}
      {isOpen && (
        <div className="md:hidden bg-white p-5 flex flex-col gap-4 border-t shadow-lg">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              className={`block ${pathname === link.href ? "text-green-700 font-bold" : "text-gray-700"}`}
            >
              {link.name}
            </Link>
          ))}
          
          {session ? (
            <div className="flex flex-col gap-4">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-green-700 font-bold">Dashboard</Link>
              <button onClick={() => { signOut(); setIsOpen(false); }} className="text-left text-red-600 font-medium">Logout</button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="text-green-700 font-bold">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}