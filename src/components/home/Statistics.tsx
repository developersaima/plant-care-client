"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Indoor",
    plants: 12,
  },
  {
    name: "Outdoor",
    plants: 8,
  },
  {
    name: "Succulent",
    plants: 6,
  },
  {
    name: "Flower",
    plants: 10,
  },
];

export default function Statistics() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-12">
        Plant Statistics
      </h2>

      <div className="bg-white rounded-xl shadow p-6 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="plants" fill="#15803d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}