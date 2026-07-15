const plants = [
  {
    id: 1,
    name: "Snake Plant",
    category: "Indoor",
    difficulty: "Easy",
  },
  {
    id: 2,
    name: "Peace Lily",
    category: "Flower",
    difficulty: "Medium",
  },
];

export default function ManagePlantsPage() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-16 ">
      <h1 className="text-4xl font-bold mb-10">
        Manage Plants
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-3">Plant</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {plants.map((plant) => (
              <tr key={plant.id} className="text-center border-b">
                <td className="p-4">{plant.name}</td>

                <td>{plant.category}</td>

                <td>{plant.difficulty}</td>

                <td>
                  <button className="text-blue-600">
                    View
                  </button>
                </td>

                <td>
                  <button className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}