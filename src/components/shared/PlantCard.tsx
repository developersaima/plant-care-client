type Plant = {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  image: string;
};

export default function PlantCard({ plant }: { plant: Plant }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg duration-300 overflow-hidden">
      <img
        src={plant.image}
        alt={plant.title}
        className="h-60 w-full object-cover"
      />

      <div className="p-5">
        <h2 className="text-xl font-bold">{plant.title}</h2>

        <p className="text-gray-500 mt-2">{plant.category}</p>

        <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
          {plant.difficulty}
        </span>

        <button className="mt-5 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800">
          View Details
        </button>
      </div>
    </div>
  );
}