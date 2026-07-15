// app/add-plant/page.tsx
import AddPlantForm from "@/components/dashboard/AddPlantForm";

export default function AddPlantPage() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Add New Plant
      </h1>

      <AddPlantForm />
    </section>
  );
}