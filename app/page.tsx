// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Hero */}
        <div className="p-8 flex flex-col justify-center gap-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Welcome to TrashGo Web
          </h1>
          <p className="text-gray-600">
            Solusi bank sampah digital yang transparan & menguntungkan  — 
            Jadwalkan penjemputan, lacak proses pengolahan, dan dapatkan reward setiap kali kamu mendaur ulang.
          </p>

          <div className="flex gap-3 mt-4">
            <Link href="/auth/login" className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700">
              Login
            </Link>
            <Link href="/auth/signup" className="px-5 py-2 rounded-lg border border-green-600 text-green-600 font-medium hover:bg-green-50">
              Daftar
            </Link>
          </div>
        </div>

        {/* Right: visual */}
        <div className="hidden md:block bg-[url('/images/hero-trashgo.png')] bg-cover bg-center" />
      </div>
    </main>
  );
}
