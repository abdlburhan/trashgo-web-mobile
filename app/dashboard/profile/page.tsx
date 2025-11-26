"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BottomNav from "@/components/BottomNav";
import { 
  User, MapPin, Phone, Trophy, Leaf, Gift, Bell, Globe, Moon, Shield, 
  History, CreditCard, LogOut, Edit2, ChevronRight, Sparkles, Trees,
  Package, Calendar, BadgeCheck, Trash2, ArrowRight, Crown 
} from "lucide-react";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatar_url?: string | null;
  membership: "basic" | "weekly" | "monthly";
  join_date: string;
  total_pickup: number;
  total_weight: number;
  points: number;
  level: string;
  co2_saved?: number;
  bottles_recycled?: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*, avatar_url")
        .eq("id", user.id)
        .single();

      // Dummy data sementara kalau belum ada di DB
      setProfile({
        ...data,
        email: user.email || "",
        phone: data?.phone || "+6281234567890",
        address: data?.address || "Jl. Merdeka No. 45, Jakarta Selatan",
        join_date: data?.join_date || "2024-01-15",
        co2_saved: 124,
        bottles_recycled: 890,
      });
    }
    loadProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5FAF5] to-[#e8f5e8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#13ec13] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Memuat profil...</p>
      </div>
    </div>
    );
  }

  const membership = {
    basic: { label: "Basic", color: "from-gray-400 to-gray-600", badge: "bg-gray-500" },
    weekly: { label: "Reguler", color: "from-green-500 to-emerald-600", badge: "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg" },
    monthly: { label: "Premium", color: "from-yellow-500 to-amber-600", badge: "bg-gradient-to-r from-yellow-500 to-amber-600 shadow-2xl" },
  }[profile.membership];

  const formatDate = (date: string) => new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const menuItems = [
    // INFORMASI AKUN
    { icon: User, label: "Edit Profil", desc: "Nama, foto, email", href: "/dashboard/profile/edit" },
    { icon: Phone, label: "Nomor Telepon", desc: profile.phone, href: "#" },
    { icon: MapPin, label: "Alamat Pickup", desc: profile.address, href: "/dashboard/profile/address" },

    // MEMBERSHIP
    { icon: BadgeCheck, label: "Status Membership", desc: `${membership.label} • Bergabung ${formatDate(profile.join_date)}`, badge: membership.label, href: "/dashboard/membership" },
    { icon: CreditCard, label: "Riwayat Pembayaran", desc: "Tagihan & invoice membership", href: "#" },

    // SAMPAH & LINGKUNGAN
    { icon: Package, label: "Riwayat Pickup", desc: `${profile.total_pickup} kali jemput`, href: "/dashboard/tracking" },
    { icon: Trash2, label: "Hasil Pemilahan", desc: "Detail jenis sampah tiap pickup", href: "#" },
    { icon: Trees, label: "Dampak Lingkungan", desc: `${profile.co2_saved}kg CO₂ terselamatkan`, href: "#" },

    // REWARDS
    { icon: Gift, label: "Poin & Rewards", desc: `${profile.points.toLocaleString()} poin tersedia`, href: "/dashboard/rewards" },
    { icon: History, label: "Riwayat Redeem", desc: "Voucher & cashback yang ditukar", href: "#" },

    // PENGATURAN
    { icon: Bell, label: "Notifikasi", desc: "Jadwal, pickup, promo", href: "#" },
    { icon: Globe, label: "Bahasa", desc: "Bahasa Indonesia", href: "#" },
    { icon: Moon, label: "Tema Gelap", desc: "Coming soon", disabled: true, href: "#" },

    // KEAMANAN
    { icon: Shield, label: "Keamanan Akun", desc: "Ganti password • 2FA", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5FAF5] to-[#e8f5e8] pb-28">
      {/* HERO HEADER */}
      <header className="bg-gradient-to-br from-[#13ec13] to-[#0fa80f] text-white pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl ring-4 ring-white/30">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Foto Profil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {/* Tombol edit */}
            <button className="absolute bottom-2 right-2 bg-white/30 backdrop-blur p-2 rounded-full">
              <Edit2 className="w-5 h-5 text-white" />
            </button>
          </div>

          <h1 className="text-4xl font-black mt-6">{profile.full_name}</h1>
          <p className="text-lg opacity-90">{profile.email}</p>
          <div className={`inline-flex items-center gap-3 mt-4 px-6 py-3 rounded-full text-xl font-bold ${membership.badge}`}>
            <Crown className="w-6 h-6" />
            {membership.label}
          </div>
        </div>
      </header>
      {/* AKHIR HEADER — SUDAH BENAR TUTUP */}

      {/* MINI STATS */}
      <div className="max-w-4xl mx-auto px-5 -mt-12">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <motion.div whileTap={{ scale: 0.95 }} className="bg-white rounded-2xl p-4 shadow-xl text-center">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-black text-gray-800">{profile.total_pickup}</p>
            <p className="text-xs text-gray-600">Pickup</p>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className="bg-white rounded-2xl p-4 shadow-xl text-center">
            <Leaf className="w-8 h-8 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-black text-gray-800">{profile.total_weight}</p>
            <p className="text-xs text-gray-600">Kg</p>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className="bg-white rounded-2xl p-4 shadow-xl text-center">
            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
            <p className="text-2xl font-black text-gray-800">{profile.level}</p>
            <p className="text-xs text-gray-600">Level</p>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className="bg-white rounded-2xl p-4 shadow-xl text-center">
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-1" />
            <p className="text-2xl font-black text-gray-800">{profile.points.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Poin</p>
          </motion.div>
        </div>
      </div>

      {/* MENU NAVIGASI */}
      <main className="max-w-4xl mx-auto px-5 space-y-4 pb-10">
        {menuItems.map((item, i) => (
          <motion.a
            key={i}
            href={item.href}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-between p-5 rounded-2xl bg-white shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:border-[#13ec13] ${item.disabled ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#13ec13]/10 to-[#0fa80f]/10 rounded-xl flex items-center justify-center">
                <item.icon className="w-6 h-6 text-[#13ec13]" />
              </div>
              <div>
                <p className="font-bold text-gray-800">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {item.badge && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${membership.badge}`}>
                  {item.badge}
                </span>
              )}
              {!item.disabled && <ChevronRight className="w-5 h-5 text-gray-400" />}
            </div>
          </motion.a>
        ))}

       {/* TOMBOL LOGOUT — TARUH DI HALAMAN PROFIL */}
<motion.button
  whileTap={{ scale: 0.95 }}
  onClick={async () => {
    // Logout dari Supabase
    await supabase.auth.signOut();

    // Pastikan langsung pindah ke login + bersihkan cache
    window.location.href = "http://localhost:3000/";
  }}
  className="w-full mt-8 py-5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-bold text-lg shadow-2xl flex items-center justify-center gap-3 hover:shadow-red-500/50 transition-all"
>
  <LogOut className="w-6 h-6" />
  Keluar dari Akun
</motion.button>
      </main>

      <BottomNav />
    </div>
  );
}