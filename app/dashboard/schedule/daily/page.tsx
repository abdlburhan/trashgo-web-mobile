"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";

export default function DailySchedulePage() {
  const router = useRouter();
  const [time, setTime] = useState("08:00");
  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState<any>(null);

  // Load jadwal yang sudah ada
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("schedules")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setExisting(data);
        if (data.time) setTime(data.time);
      }
    })();
  }, []);

  const saveDaily = async () => {
    if (!time) return alert("Pilih jam dulu ya!");

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Kamu belum login!");
      setLoading(false);
      return;
    }

    const payload = {
      type: "daily" as const,
      days: null,
      time,
      dates: null,
      user_id: user.id,
    };

    if (existing) {
      await supabase.from("schedules").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("schedules").insert(payload);
    }

    setLoading(false);
    alert("Jadwal harian berhasil disimpan!");
    router.push("/dashboard/schedule"); // LANGSUNG BALIK KE KALENDER
  };

  const cancelSchedule = async () => {
    if (!existing) return;
    if (!confirm("Yakin ingin membatalkan jadwal harian?")) return;

    setLoading(true);
    await supabase.from("schedules").delete().eq("id", existing.id);
    setLoading(false);
    alert("Jadwal harian dibatalkan");
    router.push("/dashboard/schedule");
  };

  return (
    <div className="min-h-screen bg-[#F5FAF5] pb-24">
      {/* HEADER + TOMBOL KEMBALI */}
      <header className="relative text-center py-5 border-b border-gray-200 bg-white">
        <button
          onClick={() => router.push("/dashboard/schedule")}
          className="absolute left-5 top-6 text-gray-600 font-medium"
        >
          ← Kembali
        </button>
        <h1 className="text-xl font-bold">Atur Jadwal Harian</h1>
        <p className="text-sm text-gray-600 mt-1">Penjemputan setiap hari pada jam yang dipilih</p>
      </header>

      <main className="p-5">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-8">

          {/* PILIH JAM */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700">
              Pilih Jam Pickup Setiap Hari
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl text-center text-xl font-medium"
            />
          </div>

          {/* TOMBOL SIMPAN & HAPUS */}
          <div className="flex gap-4">
            <button
              onClick={saveDaily}
              disabled={loading}
              className="flex-1 bg-[#13ec13] text-white py-4 rounded-xl font-bold disabled:opacity-50 transition"
            >
              {loading ? "Menyimpan..." : "Simpan Jadwal Harian"}
            </button>

            {existing && existing.type === "daily" && (
              <button
                onClick={cancelSchedule}
                disabled={loading}
                className="px-6 py-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-200"
              >
                Hapus
              </button>
            )}
          </div>

          {/* JADWAL AKTIF */}
          {existing && existing.type === "daily" && (
            <div className="bg-green-50 p-5 rounded-xl border border-green-200">
              <p className="font-bold text-green-800 text-lg">Jadwal Harian Aktif</p>
              <p className="text-2xl font-bold text-green-700 mt-2">
                Setiap Hari • {existing.time}
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}