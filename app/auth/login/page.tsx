// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient"; // pastikan file ini ada

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

        if (error) {
        alert("Login gagal: " + error.message);
        return;
        }

        router.push("/dashboard");
    } catch (err: unknown) {
        if (err instanceof Error) alert("Login error: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Login TrashGo</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="email@contoh.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
               className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="masukkan password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Belum punya akun?{" "}
          <Link href="/auth/signup" className="text-green-600 font-semibold">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
