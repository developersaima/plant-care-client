export default function FilterSidebar() {
  return (
    <div className="border rounded-xl p-5 h-fit ">
      <h2 className="font-bold text-xl mb-5">Filters</h2>

      <div className="mb-6">
        <label className="font-semibold block mb-2">Category</label>
        <select className="border rounded w-full p-2 bg-background text-foreground">
          <option>All</option>
          <option>Indoor</option>
          <option>Outdoor</option>
          <option>Flower</option>
          <option>Succulent</option>
        </select>
      </div>

      <div>
        <label className="font-semibold block mb-2">Difficulty</label>
        <select className="border rounded w-full p-2 bg-background text-foreground">
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
    </div>
  );
}