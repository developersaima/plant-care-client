const faqs = [
  {
    question: "How often should I water my plants?",
    answer: "Most indoor plants need water once or twice a week.",
  },
  {
    question: "Do indoor plants need sunlight?",
    answer: "Yes, indirect sunlight is best for most indoor plants.",
  },
  {
    question: "Which plant is easiest for beginners?",
    answer: "Snake Plant and Aloe Vera are great beginner-friendly plants.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-green-50 py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl text-green-700 font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow"
            >
              <h3 className="text-xl font-semibold text-green-700">
                {faq.question}
              </h3>

              <p className="mt-3 text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}