// app/about/page.tsx
import { FaLeaf } from "react-icons/fa";
import {  FiUsers, FiHeart, FiAward, FiTarget, FiShield } from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg shadow-green-700/20">
              <FaLeaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">About Plant Care</h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Your trusted companion in nurturing nature and growing a greener world, one plant at a time.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-700 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-xl">
                <FiTarget className="w-6 h-6 text-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To empower plant enthusiasts of all levels with the knowledge and tools they need to 
              cultivate thriving green spaces. We believe that everyone can grow something beautiful 
              with the right guidance and support.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <FiShield className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To create a global community of plant lovers who share knowledge, celebrate growth, 
              and contribute to a healthier planet. We envision a world where every home and office 
              is filled with the beauty and benefits of plants.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold text-green-700 mb-2">10K+</div>
            <p className="text-gray-500 text-sm font-medium">Plants Cared</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold text-blue-700 mb-2">5K+</div>
            <p className="text-gray-500 text-sm font-medium">Happy Users</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold text-yellow-700 mb-2">100+</div>
            <p className="text-gray-500 text-sm font-medium">Plant Species</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold text-purple-700 mb-2">98%</div>
            <p className="text-gray-500 text-sm font-medium">Success Rate</p>
          </div>
        </div>

       

        {/* Values Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Core Values</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaLeaf className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Sustainability</h3>
              <p className="text-sm text-gray-500">Promoting eco-friendly practices</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUsers className="w-7 h-7 text-blue-700" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Community</h3>
              <p className="text-sm text-gray-500">Building connections through plants</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiHeart className="w-7 h-7 text-yellow-700" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Passion</h3>
              <p className="text-sm text-gray-500">Loving what we do</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiAward className="w-7 h-7 text-purple-700" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Excellence</h3>
              <p className="text-sm text-gray-500">Striving for the best</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}