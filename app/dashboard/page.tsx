"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BottomNav from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import GreenFeedCard from "@/components/GreenFeedCard";
import { Package, Scale, Trophy, Sparkles, Leaf, ArrowRight } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  membership: string;
  total_pickup: number;
  total_weight: number;
  level: string;
  points: number;
}

export default function UserDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5FAF5] to-[#e8f5e8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#13ec13] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const membershipConfig = {
    basic: { label: "Basic", color: "bg-gray-500 text-white" },
    weekly: { label: "Reguler", color: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg" },
    monthly: { label: "Premium", color: "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-xl" },
  };

  const membership = membershipConfig[profile.membership as keyof typeof membershipConfig] || membershipConfig.basic;

  const feed = [
    { title: "Cara Memilah Botol Plastik", image: "https://www.rumahmesin.com/wp-content/uploads/2024/08/pemilahan-botol-plastik-1.jpg", excerpt: "Cuci bersih, lepaskan label, dan keringkan sebelum daur ulang." },
    { title: "Kompos dari Sisa Dapur", image: "https://cnc-magazine.oramiland.com/parenting/images/cara-membuat-kompos.width-800.format-webp.webp", excerpt: "Ubah sampah organik jadi pupuk berkualitas!" },
    { title: "2 Ton Plastik Didaur Ulang Minggu Ini", image: "https://img.antaranews.com/cache/1200x800/2019/09/03/20190903_152417.jpg.webp", excerpt: "Kontribusi TrashGo untuk Indonesia lebih hijau." },
    { title: "TrashGo Craft: Pot dari Botol Bekas", image: "https://www.smp1buduran.sch.id/upload/imagecache/81350355WhatsAppImage2023-01-11at07.52.19-800x369.jpeg", excerpt: "Sampah jadi karya seni yang indah." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5FAF5] to-[#e8f5e8] pb-28">
      {/* HEADER — LEBIH LEGA & GANTENG */}
      <header className="bg-gradient-to-r from-[#13ec13] to-[#0fa80f] text-white pt-20 pb-20 px-6 shadow-2xl rounded-b-3xl">
  <div className="max-w-4xl mx-auto">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-black flex items-center gap-3">
          Halo, {profile.full_name.split(" ")[0]}!
          <Sparkles className="w-10 h-10 animate-pulse" />
        </h1>
        <p className="text-xl mt-2 opacity-90">Selamat datang kembali di TrashGo</p>
      </div>
      <div className={`px-6 py-3 rounded-full text-xl font-bold shadow-2xl ${membership.color}`}>
        {membership.label}
      </div>
    </div>
  </div>
</header>

      <main className="max-w-4xl mx-auto px-5 -mt-8 space-y-8">

        {/* STAT CARD */}
        <main className="max-w-4xl mx-auto px-5 -mt-12 space-y-8"></main>
        <div className="grid grid-cols-2 gap-5">
          <StatCard icon={<Package className="w-8 h-8 text-blue-600" />} title="Total Pickup" value={profile.total_pickup} color="from-blue-500 to-cyan-500" />
          <StatCard icon={<Scale className="w-8 h-8 text-green-600" />} title="Kg Terkumpul" value={`${profile.total_weight} kg`} color="from-green-500 to-emerald-600" />
          <StatCard icon={<Trophy className="w-8 h-8 text-yellow-600" />} title="Level" value={profile.level} color="from-yellow-500 to-amber-600" />
          <StatCard icon={<Leaf className="w-8 h-8 text-purple-600" />} title="Poin Kamu" value={profile.points.toLocaleString()} color="from-purple-500 to-pink-500" />
        </div>

        {/* GREEN FEED */}
        <section className="bg-white rounded-3xl shadow-xl p-6 border border-green-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Leaf className="w-8 h-8 text-green-600" />
              Green Feed
            </h2>
            <span className="text-sm text-gray-500">Edukasi & Inspirasi</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {feed.map((item, i) => (
              <GreenFeedCard key={i} {...item} />
            ))}
          </div>
        </section>

        {/* RIWAYAT TERBARU — ICON SUDAH MUNCUL + LEBIH GANTENG */}
        <section className="bg-white rounded-3xl shadow-xl p-6 border border-green-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Riwayat Terbaru</h2>
            <a href="/dashboard/tracking" className="text-[#13ec13] font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Lihat Semua <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="space-y-4">
            {[
              { type: "Plastik", date: "12 Nov 2025", poin: 50 },
              { type: "Kertas & Kardus", date: "05 Nov 2025", poin: 35 },
              { type: "Campuran", date: "28 Okt 2025", poin: 70 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all">
                {/* ICON LUCIDE — PASTI MUNCUL */}
                <div className="w-14 h-14 bg-gradient-to-br from-[#13ec13] to-[#0fa80f] rounded-full flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-lg">Pickup Sampah {item.type}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-black text-[#13ec13]">+{item.poin}</p>
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Selesai</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}