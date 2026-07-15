import React from 'react';

const DashboardPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-gray-500 font-medium">Total Plants</h3>
        <p className="text-3xl font-bold text-green-700 mt-2">150</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-gray-500 font-medium">Pending Orders</h3>
        <p className="text-3xl font-bold text-yellow-600 mt-2">12</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-gray-500 font-medium">Total Revenue</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">$2,450</p>
      </div>
    </div>
  );
};

export default DashboardPage;