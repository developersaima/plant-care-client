import React from 'react';

const statsData = [
  { label: "Total Plants", value: "1,250", color: "text-green-700" },
  { label: "Active Users", value: "840", color: "text-blue-600" },
  { label: "Pending Cares", value: "125", color: "text-yellow-600" },
  { label: "Completed", value: "98%", color: "text-purple-600" },
];

const Statistics = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Platform Statistics
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-gray-500 text-sm font-medium mb-2">{stat.label}</p>
              <h3 className={`text-4xl font-extrabold ${stat.color}`}>
                {stat.value}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;