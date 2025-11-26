"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;
const DAY_NAME: Record<typeof DAYS[number], string> = {
  Sen: "Senin", Sel: "Selasa", Rab: "Rabu", Kam: "Kamis",
  Jum: "Jumat", Sab: "Sabtu", Min: "Minggu"
};

export default function WeeklySchedulePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [time, setTime] = useState("08:00");
  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState<any>(null);

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
        if (data.days) setSelected(data.days);
        if (data.time) setTime(data.time);
      }
    })();
  }, []);

  const toggleDay = (day: string) => {
    setSelected(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const save = async () => {
    if (selected.length === 0) return alert("Pilih minimal 1 hari!");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = { type: "weekly", days: selected, time, dates: null, user_id: user.id };

    if (existing) {
      await supabase.from("schedules").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("schedules").insert(payload);
    }

    setLoading(false);
    alert("Jadwal mingguan berhasil disimpan!");
    router.push("/dashboard/schedule"); // LANGSUNG BALIK KE KALENDER
  };

  const cancel = async () => {
    if (!existing) return alert("Belum ada jadwal untuk dibatalkan");
    if (!confirm("Yakin ingin menghapus jadwal rutin?")) return;

    setLoading(true);
    await supabase.from("schedules").delete().eq("id", existing.id);
    setLoading(false);
    alert("Jadwal dibatalkan");
    router.push("/dashboard/schedule");
  };

  return (
    <div className="min-h-screen bg-[#F5FAF5] pb-24">
      {/* HEADER DENGAN TOMBOL KEMBALI */}
      <header className="relative text-center py-5 border-b border-gray-200 bg-white">
        <button
          onClick={() => router.push("/dashboard/schedule")}
          className="absolute left-5 top-6 text-gray-600 font-medium"
        >
          ← Kembali
        </button>
        <h1 className="text-xl font-bold">Atur Jadwal Mingguan</h1>
        <p className="text-sm text-gray-600 mt-1">Pilih hari & jam penjemputan rutin</p>
      </header>

      <main className="p-5">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          {/* PILIH HARI */}
          <div className="grid grid-cols-3 gap-3">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`py-4 rounded-xl font-medium transition-all ${
                  selected.includes(day)
                    ? "bg-[#13ec13] text-white shadow-lg"
                    : "bg-gray-50 text-gray-800"
                }`}
              >
                {DAY_NAME[day]}
              </button>
            ))}
          </div>

          {/* PILIH JAM */}
          <div>
            <label className="block text-sm font-medium mb-3">Pilih Jam Pickup</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-lg"
            />
          </div>

          {/* TOMBOL AKSI */}
          <div className="flex gap-4">
            <button
              onClick={save}
              disabled={loading || selected.length === 0}
              className="flex-1 bg-[#13ec13] text-white py-4 rounded-xl font-bold disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Jadwal"}
            </button>
            {existing && (
              <button
                onClick={cancel}
                disabled={loading}
                className="px-6 py-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-200"
              >
                Hapus
              </button>
            )}
          </div>

          {/* JADWAL AKTIF */}
          {existing && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <p className="font-bold text-green-800">Jadwal Aktif</p>
              <p className="text-sm mt-1">
                {existing.days.map((d: string) => DAY_NAME[d as keyof typeof DAY_NAME]).join(" & ")} • {existing.time}
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}