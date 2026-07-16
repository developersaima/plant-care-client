export default function Newsletter() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-100 to-green-50">
      <div className="max-w-4xl mx-auto bg-green-700 rounded-2xl px-8 py-14 text-center text-white">
        <h2 className="text-4xl font-bold">
          Subscribe to Our Newsletter
        </h2>

        <p className="mt-4 text-green-100">
          Get the latest plant care tips and updates directly in your inbox.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-5 py-3 rounded-lg text-black w-full md:w-96  border border-white bg-white"
          />

          <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-100">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}