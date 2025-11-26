import { ReactNode } from "react";
import { Sparkles } from "lucide-react";  // TAMBAHIN BARIS INI!

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  color: string;
}

export default function StatCard({ icon, title, value, color }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} text-white rounded-3xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        {icon}
        <Sparkles className="w-6 h-6 opacity-70" />
      </div>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-black mt-2">{value}</p>
    </div>
  );
}