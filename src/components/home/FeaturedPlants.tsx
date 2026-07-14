import PlantCard from "../shared/PlantCard";

const plants = [
  {
    id: 1,
    title: "Snake Plant",
    category: "Indoor",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600",
  },
  {
    id: 2,
    title: "Peace Lily",
    category: "Flower",
    difficulty: "Medium",
    image:
      "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=600",
  },
  {
    id: 3,
    title: "Aloe Vera",
    category: "Medicinal",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600",
  },
  {
    id: 4,
    title: "Cactus",
    category: "Succulent",
    difficulty: "Hard",
    image:
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600",
  },
];

export default function FeaturedPlants() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-3">
        Featured Plants
      </h2>

      <p className="text-center text-gray-500 mb-12">
        Discover some popular plants for your home and garden.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </section>
  );
}