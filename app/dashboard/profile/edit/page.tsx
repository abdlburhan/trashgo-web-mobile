"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Camera, ArrowLeft, Check, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url")
        .eq("id", user.id)
        .single();

      setName(data?.full_name || "");
      setPhone(data?.phone || "");
      setAvatarUrl(data?.avatar_url || "");
      setLoading(false);
    }
    load();
  }, []);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update avatar_url di profiles
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user?.id);

      setAvatarUrl(publicUrl);
    } catch (error) {
      alert("Gagal upload foto: " + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from("profiles")
      .update({ full_name: name, phone, avatar_url: avatarUrl })
      .eq("id", user?.id);
    setLoading(false);
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5FAF5] to-[#e8f5e8]">
      <header className="bg-gradient-to-r from-[#13ec13] to-[#0fa80f] text-white pt-16 pb-10 px-6 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black">Edit Profil</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* FOTO PROFIL DENGAN UPLOAD */}
          <div className="relative inline-block mb-8">
            <div className="w-40 h-40 rounded-full overflow-hidden ring-8 ring-white shadow-2xl">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#13ec13] to-[#0fa80f] flex items-center justify-center">
                  <User className="w-20 h-20 text-white" />
                </div>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-3 right-3 bg-white shadow-xl p-4 rounded-full hover:scale-110 transition-all"
            >
              {uploading ? (
                <Upload className="w-7 h-7 text-gray-600 animate-pulse" />
              ) : (
                <Camera className="w-7 h-7 text-[#13ec13]" />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              className="hidden"
            />
          </div>

          {/* FORM */}
          <div className="space-y-6">
            <div>
              <label className="block text-left text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#13ec13] focus:outline-none transition"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-left text-sm font-bold text-gray-700 mb-2">Nomor Telepon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#13ec13] focus:outline-none transition"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <button
              onClick={saveProfile}
              disabled={loading}
              className="w-full mt-10 bg-gradient-to-r from-[#13ec13] to-[#0fa80f] text-white py-5 rounded-2xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 hover:shadow-2xl transition-all disabled:opacity-70"
            >
              {loading ? "Menyimpan..." : <>Simpan Perubahan <Check className="w-6 h-6" /></>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}