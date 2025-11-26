"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BottomNav from "@/components/BottomNav";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import Link from "next/link";

type ScheduleRecord = {
  id: string;
  user_id: string;
  type: "daily" | "weekly";
  days: string[] | null;
  time: string | null;
  dates: number[] | null;
};

const DAY_NAME_ORDER = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function SchedulePage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(today));
  const [calendarGrid, setCalendarGrid] = useState<{ date: Date; inMonth: boolean }[]>([]);
  const [schedule, setSchedule] = useState<ScheduleRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Build calendar grid
  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const firstGrid = startOfWeek(start, { weekStartsOn: 0 });
    const lastGrid = addDays(end, 6 - end.getDay());
    const grid: { date: Date; inMonth: boolean }[] = [];

    for (let d = firstGrid; d <= lastGrid; d = addDays(d, 1)) {
      grid.push({ date: new Date(d), inMonth: d.getMonth() === currentMonth.getMonth() });
    }
    setCalendarGrid(grid);
  }, [currentMonth]);

  // Load schedule
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("schedules")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setSchedule(data as ScheduleRecord | null);
      setLoading(false);
    })();
  }, []);

  // Highlight dates berdasarkan jadwal mingguan
  const highlightedDates = useMemo(() => {
    if (!schedule || schedule.type !== "weekly" || !schedule.days?.length) return [];

    const dates: number[] = [];
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      const dayName = DAY_NAME_ORDER[d.getDay()];
      if (schedule.days.includes(dayName)) {
        dates.push(d.getDate());
      }
    }
    return dates;
  }, [schedule, currentMonth]);

  // Format label jadwal
  const scheduleLabel = schedule
    ? schedule.type === "daily"
      ? `Harian • ${schedule.time}`
      : schedule.days
        ? `${schedule.days.map(d => ({
            Sen: "Senin", Sel: "Selasa", Rab: "Rabu", Kam: "Kamis",
            Jum: "Jumat", Sab: "Sabtu", Min: "Minggu"
          }[d])).join(" & ")} • ${schedule.time || "-"}`
        : "Mingguan"
    : null;

  // Hapus jadwal
  const handleCancel = async () => {
    if (!schedule || !confirm("Yakin ingin membatalkan jadwal rutin?")) return;

    setLoading(true);
    await supabase.from("schedules").delete().eq("id", schedule.id);
    setSchedule(null);
    setLoading(false);
    alert("Jadwal berhasil dibatalkan!");
  };

  return (
    <div className="pb-24 min-h-screen bg-[#F5FAF5]">
      {/* HEADER */}
      <header className="p-6 text-center">
        <h1 className="text-2xl font-semibold text-[#0e3b0e]">Jadwal Pickup</h1>

        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-gray-500">Memuat jadwal...</p>
          ) : schedule ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-gray-700">{scheduleLabel}</p>
              <button
                onClick={handleCancel}
                className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200"
              >
                Batalkan Jadwal
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Belum ada jadwal rutin</p>
          )}
        </div>

        <hr className="mt-6 max-w-2xl mx-auto border-t border-gray-200" />
      </header>

      {/* KALENDER */}
      <main className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-xl border border-green-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-2xl">&lt;</button>
            <h2 className="text-lg font-bold text-gray-800">{format(currentMonth, "LLLL yyyy")}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-2xl">&gt;</button>
          </div>

          <div className="grid grid-cols-7 text-center text-sm font-bold text-gray-700 mb-2">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarGrid.map((cell, i) => {
              const day = cell.date.getDate();
              const isCurrentMonth = cell.inMonth;
              const isHighlighted = isCurrentMonth && highlightedDates.includes(day);

              return (
                <div
                  key={i}
                  className={`h-11 flex items-center justify-center rounded-full text-sm font-medium transition-all
                    ${!isCurrentMonth ? "text-gray-300" : ""}
                    ${isHighlighted ? "bg-[#13ec13] text-white shadow-lg scale-110" : "hover:bg-gray-100"}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href="/dashboard/schedule/weekly"
              className="flex-1 bg-green-100 text-green-800 text-center py-3 rounded-lg font-semibold hover:bg-green-200 transition"
            >
              Atur Jadwal Mingguan
            </Link>
            <Link
              href="/dashboard/schedule/daily"
              className="flex-1 bg-[#13ec13] text-white text-center py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Atur Jadwal Harian
            </Link>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}