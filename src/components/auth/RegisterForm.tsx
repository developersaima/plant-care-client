"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const onSubmit = (data: RegisterData) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white text-black shadow-xl rounded-xl p-8"
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        Register
      </h1>

      <div className="mb-4">
        <label>Name</label>

        <input
          {...register("name", {
            required: "Name is required",
          })}
          className="w-full border p-3 rounded-lg mt-2"
        />

        <p className="text-red-500 text-sm">
          {errors.name?.message}
        </p>
      </div>

      <div className="mb-4">
        <label>Email</label>

        <input
          type="email"
          {...register("email", {
            required: "Email is required",
          })}
          className="w-full border p-3 rounded-lg mt-2"
        />

        <p className="text-red-500 text-sm">
          {errors.email?.message}
        </p>
      </div>

      <div className="mb-6">
        <label>Password</label>

        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: 6,
          })}
          className="w-full border p-3 rounded-lg mt-2"
        />

        <p className="text-red-500 text-sm">
          {errors.password?.message}
        </p>
      </div>

      <button
        className="w-full bg-green-700 text-white py-3 rounded-lg"
      >
        Register
      </button>

      <p className="text-center mt-5">
        Already have an account?
        <Link
          href="/login"
          className="text-green-700 ml-2"
        >
          Login
        </Link>
      </p>
    </form>
  );
}