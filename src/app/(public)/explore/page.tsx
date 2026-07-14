import PlantCard from "@/components/shared/PlantCard";
import SearchBar from "@/components/explore/SearchBar";
import FilterSidebar from "@/components/explore/FilterSidebar";
import SortSelect from "@/components/explore/SortSelect";

const plants = [
  {
    id: 1,
    title: "Snake Plant",
    category: "Indoor",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500",
  },
  {
    id: 2,
    title: "Aloe Vera",
    category: "Medicinal",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500",
  },
  {
    id: 3,
    title: "Peace Lily",
    category: "Flower",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=500",
  },
  {
    id: 4,
    title: "Cactus",
    category: "Succulent",
    difficulty: "Hard",
    image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=500",
  },
  {
    id: 5,
    title: "Monstera Deliciosa",
    category: "Indoor",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500",
  },
  {
    id: 6,
    title: "Fiddle Leaf Fig",
    category: "Indoor",
    difficulty: "Hard",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=500",
  },
];

export default function ExplorePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-10">
        Explore Plants
      </h1>

      <SearchBar />

      <div className="flex justify-end my-6">
        <SortSelect />
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <FilterSidebar />

        <div className="lg:col-span-3 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-10">
        <button className="px-4 py-2 border rounded bg-green-700 text-white">
          1
        </button>

        <button className="px-4 py-2 border rounded">
          2
        </button>

        <button className="px-4 py-2 border rounded">
          3
        </button>
      </div>
    </div>
  );
}