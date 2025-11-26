"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BottomNav from "@/components/BottomNav";
import { Trophy, Gem, History, Wallet, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export default function RewardsPage() {
  const [points, setPoints] = useState(3800);
  const [user, setUser] = useState<any>(null);
  const [walletNumber, setWalletNumber] = useState("");
  const [walletType, setWalletType] = useState("dana");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Hitung level
  const getLevel = (pts: number) => {
    if (pts >= 40000) return { name: "Diamond", color: "from-cyan-400 to-blue-600", next: null };
    if (pts >= 30000) return { name: "Platinum", color: "from-purple-400 to-purple-600", next: 40000 };
    if (pts >= 20000) return { name: "Gold", color: "from-yellow-400 to-amber-600", next: 30000 };
    if (pts >= 10000) return { name: "Silver", color: "from-gray-300 to-gray-500", next: 20000 };
    return { name: "Bronze", color: "from-orange-400 to-red-600", next: 10000 };
  };

  const level = getLevel(points);
  const progress = level.next ? (points / level.next) * 100 : 100;

  // Load user + points + history
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // Ganti ini nanti dengan tabel users yang punya kolom points
      // Contoh sementara:
      // const { data } = await supabase.from("profiles").select("points").eq("id", user.id).single();
      // setPoints(data?.points || 0);

      // Load riwayat penukaran
      const { data: hist } = await supabase
        .from("redeem_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setHistory(hist || []);
    })();
  }, []);

  // Tukar ke Cashback
  const tukarCashback = async () => {
    if (!walletNumber || walletNumber.length < 10) return alert("Nomor e-wallet tidak valid");
    if (points < 1000) return alert("Poin minimal 1000 untuk tukar cashback");

    setLoading(true);
    const amount = Math.floor(points / 100) * 100; // 100 poin = Rp1.000 → kelipatan 100
    const redeemAmount = amount / 100; // dalam ribuan

    const { error } = await supabase.from("redeem_history").insert({
      user_id: user.id,
      type: "cashback",
      provider: walletType,
      destination: walletNumber,
      points_used: amount,
      rupiah: redeemAmount * 1000,
      status: "pending",
    });

    if (!error) {
      setPoints(points - amount);
      setShowSuccess(true);
      setWalletNumber("");
      setTimeout(() => setShowSuccess(false), 4000);
      // Refresh history
      const { data } = await supabase.from("redeem_history").select("*").eq("user_id", user.id);
      setHistory(data || []);
    } else {
      alert("Gagal tukar: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5FAF5] to-[#e8f5e8] pb-28">
      {/* HEADER */}
      <header className="bg-white shadow-xl sticky top-0 z-10">
        <div className="p-5 text-center">
          <h1 className="text-2xl font-bold text-[#0e3b0e] flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            Rewards & Poin
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-5 space-y-6">

        {/* 1. TOTAL POIN + PROGRESS */}
        <div className="bg-gradient-to-r from-[#13ec13] to-[#0fa80f] text-white rounded-3xl p-8 shadow-2xl">
          <p className="text-lg opacity-90">Total Poin Kamu</p>
          <p className="text-6xl font-black mt-2">{points.toLocaleString("id-ID")}</p>
          <div className="flex items-center gap-3 mt-4">
            <Trophy className="w-10 h-10" />
            <p className="text-2xl font-bold">Level {level.name}</p>
          </div>
          {level.next && (
            <p className="mt-3 text-lg opacity-90">
              {level.next - points} poin lagi menuju <span className="font-bold">{getLevel(level.next).name}</span>
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#13ec13] to-[#0fa80f] rounded-full flex items-center justify-end pr-5 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            >
              <span className="text-white font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* 2. KONVERSI */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl p-6 text-center shadow-xl">
          <p className="text-3xl font-black">1 kg = 50 Poin</p>
          <p className="text-lg mt-2 opacity-90">Atau 1.000 poin = Rp10.000</p>
        </div>

        {/* 3. VOUCHER PARTNER */}
        <section className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-5 text-center">Voucher Partner</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Shopee", poin: 10000, color: "from-orange-500 to-red-500" },
              { name: "Tokopedia", poin: 10000, color: "from-green-500 to-emerald-600" },
              { name: "Gojek", poin: 15000, color: "from-lime-500 to-green-600" },
              { name: "Grab", poin: 15000, color: "from-emerald-500 to-teal-600" },
            ].map((v) => (
              <button
                key={v.name}
                disabled={points < v.poin}
                className={`rounded-2xl p-5 text-white font-bold shadow-lg transform hover:scale-105 transition-all bg-gradient-to-br ${v.color} ${points < v.poin ? "opacity-60" : ""}`}
              >
                <p className="text-xl">{v.name}</p>
                <p className="text-sm mt-1">{v.poin.toLocaleString()} poin</p>
              </button>
            ))}
          </div>
        </section>

        {/* 4. CASHBACK KE E-WALLET */}
        <section className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-green-600" />
            Tukar ke Cashback
          </h3>

          <div className="space-y-4">
            <select
              value={walletType}
              onChange={(e) => setWalletType(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg"
            >
              <option value="dana">DANA</option>
              <option value="ovo">OVO</option>
              <option value="gopay">GoPay</option>
              <option value="shopeepay">ShopeePay</option>
            </select>

            <input
              type="tel"
              placeholder="Masukkan nomor e-wallet"
              value={walletNumber}
              onChange={(e) => setWalletNumber(e.target.value.replace(/\D/g, ""))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg"
            />

            <button
              onClick={tukarCashback}
              disabled={loading || points < 1000 || !walletNumber}
              className="w-full bg-gradient-to-r from-[#13ec13] to-[#0fa80f] text-white py-5 rounded-xl font-bold text-xl disabled:opacity-50"
            >
              {loading ? "Memproses..." : `Tukar ${(points - (points % 100)).toLocaleString()} poin → Rp${((points - (points % 100)) / 100 * 1000).toLocaleString()}`}
            </button>

            {showSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-8 h-8" />
                <p className="font-bold">Permintaan cashback berhasil dikirim! Mohon tunggu 1x24 jam.</p>
              </div>
            )}
          </div>
        </section>

        {/* 5. RIWAYAT PENUKARAN */}
        <section className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <History className="w-7 h-7 text-gray-600" />
            Riwayat Penukaran
          </h3>

          {history.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada riwayat penukaran</p>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{h.type === "cashback" ? "Cashback" : "Voucher"} • {h.provider?.toUpperCase() || h.voucher}</p>
                      <p className="text-sm text-gray-600">
                        {h.points_used.toLocaleString()} poin → Rp{h.rupiah?.toLocaleString() || "10.000"}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      h.status === "completed" ? "bg-green-100 text-green-800" :
                      h.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {h.status}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(h.created_at).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <BottomNav />
    </div>
  );
}