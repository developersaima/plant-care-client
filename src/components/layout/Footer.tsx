import Link from "next/link";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <h2 className="text-3xl font-bold text-green-300">PlantCare</h2>
          <p className="mt-4 text-sm text-gray-300 leading-6">
            PlantCare helps you organize and manage your plants with ease.
            Track watering schedules and keep your plants healthy.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

          <div className="flex flex-col gap-2 text-gray-300">
            <Link href="/">Home</Link>
            <Link href="/explore">Explore</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>

          <div className="space-y-3 text-gray-300 text-sm">
            <p className="flex items-center gap-2">
              <MdLocationOn className="text-lg text-green-300" />
              Dhaka, Bangladesh
            </p>

            <p className="flex items-center gap-2">
              <MdPhone className="text-lg text-green-300" />
              +880 1712-345678
            </p>

            <p className="flex items-center gap-2">
              <MdEmail className="text-lg text-green-300" />
              support@plantcare.com
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>

          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              className="bg-green-700 hover:bg-green-600 p-3 rounded-full transition"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              className="bg-green-700 hover:bg-green-600 p-3 rounded-full transition"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              className="bg-green-700 hover:bg-green-600 p-3 rounded-full transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-green-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
          <p>© 2026 PlantCare Tracker. All Rights Reserved.</p>

          <div className="flex gap-5 mt-3 md:mt-0">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}