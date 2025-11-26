"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import React from "react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Daftarkan akun Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert("Signup gagal: " + error.message);
        setLoading(false);
        return;
      }

      // 2. Masukkan data profil user ke tabel "profiles"
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user?.id,
            full_name: name,
            email: email,
            membership: "basic", // default new user
            points: 0,
          },
        ]);

      if (profileError) {
        alert("Gagal menyimpan profil: " + profileError.message);
        return;
      }

      alert("Akun berhasil dibuat! Silakan login.");
      router.push("/auth/login");
    } catch (err) {
        const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      alert("Signup error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Daftar TrashGo
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
               className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Nama kamu"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
               className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="email@contoh.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="minimal 6 karakter"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>

        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="text-green-600 font-semibold">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
