import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-100 to-green-50">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 items-center gap-10">
        <div>
          <h1 className="text-5xl font-bold leading-tight text-gray-800">
            Keep Your Plants
            <span className="text-green-700"> Healthy</span> &
            <span className="text-green-700"> Organized</span>
          </h1>

          <p className="mt-6 text-gray-600">
            Manage your plants, track watering schedules, and learn proper
            plant care with PlantCare Tracker.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/explore"
              className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
            >
              Explore Plants
            </Link>

            <Link
              href="/dashboard/add-plant"
              className="border border-green-700 text-green-700 px-6 py-3 rounded-lg hover:bg-green-700 hover:text-white"
            >
              Add Plant
            </Link>
          </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800"
            alt="plant"
            className="rounded-2xl shadow-xl h-[450px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}