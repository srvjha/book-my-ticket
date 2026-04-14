"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { setToken, checkAuth } from "@/lib/api";
import apiClient from "@/lib/axios";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiClient.post("/api/v1/auth/signin", {
        email,
        password,
      });
      const data = res.data;
      if (data.success) {
        setToken(data.data.accessToken);
        const userData = await checkAuth();
        if (userData) {
          const redirect = searchParams.get("redirect") || "/";
          router.push(redirect);
          setTimeout(() => router.refresh(), 100);
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 bg-zinc-900/50 p-10 rounded-3xl border border-zinc-800 backdrop-blur-sm shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight">Welcome Back</h2>
            <p className="text-zinc-500 mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-700"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-white text-zinc-950 font-bold py-4 rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Continue"}
            </motion.button>
          </form>

          <div className="text-center text-sm">
            <span className="text-zinc-500">Don&apos;t have an account?</span>
            <Link
              href="/signup"
              className="text-emerald-500 font-bold ml-1 hover:underline underline-offset-4"
            >
              Create one
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
