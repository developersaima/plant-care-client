const tips = [
  "Water plants regularly but avoid overwatering.",
  "Keep plants where they get proper sunlight.",
  "Use organic fertilizer every month.",
  "Remove dry leaves to keep plants healthy.",
];

export default function CareTips() {
  return (
    <section className="bg-green-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl text-green-700 font-bold text-center mb-12">
          Plant Care Tips
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow"
            >
              <h3 className="text-xl font-semibold text-green-700">
                Tip {index + 1}
              </h3>

              <p className="mt-3 text-gray-600">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}