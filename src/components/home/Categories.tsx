const categories = [
  {
    title: "Indoor Plants",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500",
  },
  {
    title: "Outdoor Plants",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500",
  },
  {
    title: "Succulents",
    image:
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=500",
  },
  {
    title: "Flower Plants",
    image:
      "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=500",
  },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-r from-green-100 to-green-50">
      <h2 className="text-4xl font-bold text-center mb-12 text-green-600">
        Plant Categories
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((item) => (
          <div
            key={item.title}
            className="rounded-xl overflow-hidden shadow hover:shadow-lg duration-300 bg-white"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-56 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-semibold text-green-600">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}