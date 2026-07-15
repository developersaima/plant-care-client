"use client";

import { useForm } from "react-hook-form";

type PlantForm = {
  title: string;
  category: string;
  difficulty: string;
  watering: string;
  image: string;
  description: string;
};

export default function AddPlantForm() {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<PlantForm>();

  const onSubmit = (data: PlantForm) => {
    console.log(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-lg rounded-xl p-8 space-y-5 text-black"
    >
      <input
        {...register("title")}
        placeholder="Plant Name"
        className="w-full border p-3 rounded-lg text-black"
      />

      <select
        {...register("category")}
        className="w-full border p-3 rounded-lg"
      >
        <option>Indoor</option>
        <option>Outdoor</option>
        <option>Flower</option>
        <option>Succulent</option>
      </select>

      <select
        {...register("difficulty")}
        className="w-full border p-3 rounded-lg"
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <input
        {...register("watering")}
        placeholder="Watering Frequency"
        className="w-full border p-3 rounded-lg"
      />

      <input
        {...register("image")}
        placeholder="Image URL"
        className="w-full border p-3 rounded-lg"
      />

      <textarea
        {...register("description")}
        placeholder="Description"
        rows={5}
        className="w-full border p-3 rounded-lg text-black"
      />

      <button
        className="w-full bg-green-700 text-white py-3 rounded-lg"
      >
        Add Plant
      </button>
    </form>
  );
}