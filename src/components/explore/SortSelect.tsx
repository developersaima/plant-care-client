export default function SortSelect() {
  return (
    <select className="border border-gray-300 p-2.5 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-600 transition-all">
      <option className="bg-background text-foreground">Name A-Z</option>
      <option className="bg-background text-foreground">Name Z-A</option>
      <option className="bg-background text-foreground">Easy First</option>
      <option className="bg-background text-foreground">Hard First</option>
    </select>
  );
}