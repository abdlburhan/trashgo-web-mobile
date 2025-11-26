"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Truck, Gift, User } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/schedule", icon: CalendarDays, label: "Jadwal" },
    { href: "/dashboard/tracking", icon: Truck, label: "Tracking" },
    { href: "/dashboard/rewards", icon: Gift, label: "Rewards" },
    { href: "/dashboard/profile", icon: User, label: "Profil" },
  ];

  // INI YANG DI-FIX — SEKARANG AKTIF BENAR DI SEMUA HALAMAN
  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      
      <div className="relative bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-around items-end py-3 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center gap-1 pt-2 pb-3 flex-1 group"
                >
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-t from-[#13ec13]/20 to-transparent rounded-3xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <div className="relative">
                    <Icon
                      size={26}
                      className={`transition-all duration-300 ${
                        active ? "text-[#13ec13] drop-shadow-lg" : "text-gray-500 group-hover:text-gray-700"
                      }`}
                      strokeWidth={active ? 3 : 2}
                    />
                    {active && (
                      <motion.div
                        className="absolute -inset-2 bg-[#13ec13]/30 rounded-full blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      />
                    )}
                  </div>

                  <span
                    className={`text-xs font-semibold transition-all duration-300 ${
                      active ? "text-[#13ec13] scale-110" : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>

                  {active && (
                    <motion.div
                      className="absolute -top-1 w-2 h-2 bg-[#13ec13] rounded-full shadow-lg"
                      layoutId="activeDot"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-8 bg-white/95 backdrop-blur-xl" />
    </nav>
  );
}