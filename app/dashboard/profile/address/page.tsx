"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddressPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("profiles").select("address").eq("id", user?.id).single();
      setAddress(data?.address || "");
      setLoading(false);
    }
    load();
  }, []);

  const saveAddress = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ address }).eq("id", user?.id);
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5FAF5] to-[#e8f5e8]">
      <header className="bg-gradient-to-r from-[#13ec13] to-[#0fa80f] text-white pt-16 pb-10 px-6 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black">Ubah Alamat Pickup</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-64 mb-8 flex items-center justify-center">
            <MapPin className="w-20 h-20 text-gray-400" />
          </div>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={5}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#13ec13] focus:outline-none transition resize-none"
            placeholder="Tulis alamat lengkap pickup sampahmu (jalan, RT/RW, kelurahan, kecamatan, kota)"
          />

          <button
            onClick={saveAddress}
            disabled={loading || !address}
            className="w-full mt-8 bg-gradient-to-r from-[#13ec13] to-[#0fa80f] text-white py-5 rounded-2xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
          >
            {loading ? "Menyimpan..." : <>Simpan Alamat <Check className="w-6 h-6" /></>}
          </button>
        </div>
      </main>
    </div>
  );
}