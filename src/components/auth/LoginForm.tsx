"use client";

import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setValue, // ভ্যালু সেট করার জন্য প্রয়োজন
    formState: { errors, isSubmitting },
  } = useForm<LoginData>();

  const router = useRouter();

  const onSubmit = async (data: LoginData) => {
    await signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Login successful!");
          router.push("/");
        },
        onError: (ctx: { error: { message: string } }) => {
          toast.error(ctx.error.message || "Login failed!");
        },
      }
    );
  };

  const handleDemoLogin = () => {
    setValue("email", "demo@gmail.com");
    setValue("password", "Demo@001");
    handleSubmit(onSubmit)();
  };
  // const handleDemoAdminLogin = () => {
  //   setValue("email", "admin@gmail.com");
  //   setValue("password", "Admin@001");
  //   handleSubmit(onSubmit)();
  // };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white text-black shadow-xl rounded-xl p-8"
    >
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

      <div className="mb-4">
        <label>Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full border p-3 rounded-lg mt-2"
        />
        <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
      </div>

      <div className="mb-6">
        <label>Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="w-full border p-3 rounded-lg mt-2"
        />
        <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
      </div>

      <button
        disabled={isSubmitting}
        className="w-full bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={isSubmitting}
        className="w-full border border-green-700 text-green-700 mt-4 py-3 rounded-lg hover:bg-green-50 transition"
      >
        Demo Login
      </button>
      {/* <button
        type="button"
        onClick={handleDemoAdminLogin}
        disabled={isSubmitting}
        className="w-full border border-green-700 text-green-700 mt-4 py-3 rounded-lg hover:bg-green-50 transition"
      >
        Demo Login Admin
      </button> */}

      <p className="text-center mt-5">
        Don't have an account?
        <Link href="/register" className="text-green-700 ml-2 font-bold">
          Register
        </Link>
      </p>
    </form>
  );
}