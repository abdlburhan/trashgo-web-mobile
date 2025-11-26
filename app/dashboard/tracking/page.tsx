"use client";

import { useState, useRef } from "react";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { 
  Truck, MapPin, Package, Recycle, Leaf, Trees, Download, Star, HelpCircle,
  Clock, CheckCircle2, AlertCircle, Camera, MessageSquare, FileText, ArrowRight
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function TrackingPage() {
  const reportRef = useRef<HTMLDivElement>(null);

  // DATA TRACKING REAL-TIME
  const trackingData = {
    id: "TRG-29844",
    status: "Sedang Dipilah",
    pickupDate: "13 Feb 2025",
    weight: 2.4,
    points: 120,
    composition: [
      { label: "Organik", value: 40, color: "#22c55e" },
      { label: "Anorganik", value: 45, color: "#3b82f6" },
      { label: "B3", value: 5, color: "#f59e0b" },
      { label: "Residu", value: 10, color: "#ef4444" },
    ],
    processing: { recycled: 55, compost: 30, energy: 10, landfill: 5 },
    impact: { co2: 1.3, energy: 0.8, water: 12, trees: 0.07 },
    notes: "Sampah plastik cukup banyak dan dalam kondisi bersih. Organik: banyak sisa sayuran. Tidak ditemukan sampah B3 berbahaya."
  };

  const timeline = [
    { time: "08:21", title: "Driver menuju lokasi", done: true },
    { time: "08:35", title: "Sampah dijemput", done: true },
    { time: "08:49", title: "Tiba di fasilitas", done: true },
    { time: "09:02", title: "Sampah ditimbang", done: true },
    { time: "09:10", title: "Mulai pemilahan", done: true },
    { time: "09:25", title: "Proses selesai", done: false, current: true },
  ];

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save(`Laporan-TrashGo-${trackingData.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-[#dcfce7] pb-32">
      {/* HERO STATUS */}
      <header className="bg-gradient-to-r from-[#13ec13] to-[#0fa80f] text-white pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full mx-auto mb-4 flex items-center justify-center">
              <Truck className="w-14 h-14" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-black">Tracking Sampah</h1>
          <p className="text-2xl font-bold mt-2">{trackingData.id}</p>
          <div className="mt-6 inline-flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-xl rounded-full text-xl font-bold">
            <AlertCircle className="w-7 h-7" />
            {trackingData.status}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 -mt-10 space-y-6" ref={reportRef}>
        {/* STATUS BOX */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl p-6 border border-green-100">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Pickup Terakhir</p>
              <p className="text-xl font-black text-[#13ec13]">{trackingData.pickupDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Berat Sementara</p>
              <p className="text-xl font-black text-[#13ec13]">{trackingData.weight} kg</p>
            </div>
          </div>
          <div className="mt-6 bg-gradient-to-r from-[#13ec13]/10 to-[#0fa80f]/10 rounded-2xl p-6 text-center">
            <p className="text-3xl font-black text-[#13ec13]">+{trackingData.points} Poin</p>
            <p className="text-sm text-gray-600">50 poin per kg • Terima kasih!</p>
          </div>
        </motion.div>

        {/* LIVE MAP (SIMULASI) */}
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-b from-sky-400 to-sky-600 h-64 relative flex items-center justify-center">
            <div className="text-white text-center">
              <MapPin className="w-16 h-16 mx-auto mb-3 animate-pulse" />
              <p className="text-2xl font-black">Live Tracking</p>
              <p className="text-lg opacity-90">Driver sedang menuju fasilitas</p>
            </div>
            <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
              <p className="text-white font-bold">Fasilitas Pemilahan TrashGo</p>
            </div>
          </div>
        </motion.div>

        {/* TIMELINE */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#13ec13]" />
            Timeline Perjalanan
          </h3>
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-5">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.done ? 'bg-[#13ec13]' : item.current ? 'bg-yellow-500 ring-4 ring-yellow-200' : 'bg-gray-300'}`}>
                    {item.done ? <CheckCircle2 className="w-7 h-7 text-white" /> : <Clock className="w-6 h-6 text-white" />}
                  </div>
                  {i < timeline.length - 1 && <div className="absolute top-12 left-6 w-0.5 h-20 bg-gray-300" />}
                </div>
                <div className="flex-1 pb-8">
                  <p className="font-bold text-lg">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.time} • 13 Feb 2025</p>
                  {item.current && <p className="text-yellow-600 font-bold mt-2">Sedang Berlangsung</p>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* DONUT CHART + BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-black text-center mb-6">Komposisi Sampah</h3>
            <div className="relative w-64 h-64 mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="40" />
                {(() => {
                  let offset = 0;
                  return trackingData.composition.map((slice) => {
                    const dash = (slice.value / 100) * 502;
                    const result = (
                      <circle
                        key={slice.label}
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke={slice.color}
                        strokeWidth="40"
                        strokeDasharray={`${dash} 502`}
                        strokeDashoffset={`-${offset}`}
                        className="transition-all duration-1000"
                      />
                    );
                    offset += dash;
                    return result;
                  });
                })()}
                <circle cx="100" cy="100" r="60" fill="white" />
                <text x="100" y="95" textAnchor="middle" className="text-4xl font-black fill-[#13ec13]">{trackingData.weight} kg</text>
                <text x="100" y="115" textAnchor="middle" className="text-sm fill-gray-600">Total</text>
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {trackingData.composition.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-xl">{item.value}%</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[#13ec13] to-[#0fa80f] rounded-3xl shadow-2xl p-8 text-white">
            <h3 className="text-2xl font-black mb-6">Hasil Pemrosesan</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Recycle className="w-10 h-10" />
                  <div>
                    <p className="text-3xl font-black">{trackingData.processing.recycled}%</p>
                    <p>Daur Ulang</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Leaf className="w-10 h-10" />
                  <div>
                    <p className="text-3xl font-black">{trackingData.processing.compost}%</p>
                    <p>Kompos</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Package className="w-10 h-10" />
                  <div>
                    <p className="text-2xl font-black">{trackingData.processing.energy}%</p>
                    <p>Waste-to-Energy</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* DETAIL PENIMBANGAN */}
        <motion.div initial={{ y: 30 }} animate={{ y: 0 }} className="bg-white rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-black mb-6">Detail Penimbangan</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Berat</span>
                <span className="font-bold text-xl">{trackingData.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Organik</span>
                <span className="font-bold text-green-600">0.9 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Anorganik</span>
                <span className="font-bold text-blue-600">1.1 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">B3</span>
                <span className="font-bold text-yellow-600">0.1 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Residu</span>
                <span className="font-bold text-red-600">0.3 kg</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* DAMPAK LINGKUNGAN */}
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-10 text-white text-center">
          <h3 className="text-3xl font-black mb-8">Dampak Lingkunganmu</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <Leaf className="w-16 h-16 mx-auto mb-3" />
              <p className="text-4xl font-black">{trackingData.impact.co2} kg</p>
              <p className="text-lg">CO₂ Terselamatkan</p>
            </div>
            <div>
              <Trees className="w-16 h-16 mx-auto mb-3" />
              <p className="text-4xl font-black">0.07</p>
              <p className="text-lg">Setara Pohon</p>
            </div>
          </div>
        </motion.div>

        {/* CATATAN OPERATOR */}
        <motion.div initial={{ y: 30 }} animate={{ y: 0 }} className="bg-gray-50 rounded-3xl p-8 border-2 border-dashed border-gray-300">
          <div className="flex items-start gap-4">
            <MessageSquare className="w-8 h-8 text-[#13ec13] mt-1" />
            <div>
              <p className="font-bold text-lg mb-2">Catatan dari Tim TrashGo</p>
              <p className="text-gray-700 leading-relaxed">{trackingData.notes}</p>
            </div>
          </div>
        </motion.div>

        {/* AKSI */}
        <div className="grid grid-cols-2 gap-4 pt-6">
          <button onClick={downloadPDF} className="bg-[#13ec13] text-white py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
            <Download className="w-6 h-6" />
            Unduh Laporan PDF
          </button>
          <button className="bg-white border-2 border-[#13ec13] text-[#13ec13] py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
            <Star className="w-6 h-6" />
            Beri Rating Driver
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}