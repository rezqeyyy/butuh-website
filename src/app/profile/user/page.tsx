"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase"; 
import { User, Camera, LogOut, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>({ full_name: "", avatar_url: "" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data || { full_name: "" });
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) {
        alert("Gagal upload ke storage.");
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const newAvatarUrl = data.publicUrl;
      
      const { error: updateError } = await supabase.from("profiles").update({ 
        avatar_url: newAvatarUrl 
      }).eq("id", user?.id);

      if (updateError) {
        alert("Gagal simpan URL ke database.");
        setUploading(false);
        return;
      }

      setProfile({ ...profile, avatar_url: newAvatarUrl });
      
    } catch (error: any) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaveStatus('saving');
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      avatar_url: profile.avatar_url
    }).eq("id", user?.id);

    if (error) {
      setSaveStatus('error');
    } else {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-gray-400 dark:text-zinc-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-12 pb-24 transition-colors duration-300">
      <div className="max-w-xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Pengaturan Profil</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            Kelola informasi data diri dan foto profilmu di sini.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 transition-colors">
          <div className="flex items-center gap-6">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center transition-all">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-gray-400 dark:text-zinc-500" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="animate-spin text-white w-6 h-6" />
                  </div>
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 bg-white dark:bg-zinc-800 p-2 rounded-full border border-gray-200 dark:border-zinc-700 shadow-sm cursor-pointer hover:scale-105 hover:text-[#1a56db] dark:hover:text-blue-400 transition-all">
                <Camera size={16} className="text-gray-600 dark:text-gray-300 group-hover:text-[#1a56db] dark:group-hover:text-blue-400" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.full_name || "Pengguna Baru"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Format foto: JPG atau PNG.
              </p>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-zinc-800" />

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Lengkap
              </label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 focus:ring-2 focus:ring-[#1a56db]/20 dark:focus:ring-blue-500/20 focus:border-[#1a56db] dark:focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                value={profile.full_name} 
                onChange={(e) => setProfile({...profile, full_name: e.target.value})} 
                placeholder="Masukkan nama lengkapmu..."
              />
            </div>

            <div className="pt-2">
              <button 
                onClick={handleUpdateProfile}
                disabled={saveStatus === 'saving'}
                className="w-full bg-[#1a56db] hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saveStatus === 'saving' ? <Loader2 className="animate-spin w-5 h-5" /> : "Simpan Perubahan"}
              </button>

              <div className="h-6 mt-3">
                {saveStatus === 'success' && (
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-bottom-1">
                    <CheckCircle2 size={16}/> Perubahan berhasil disimpan
                  </p>
                )}
                {saveStatus === 'error' && (
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-bottom-1">
                    <AlertCircle size={16}/> Gagal menyimpan perubahan
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8">
          <button 
            onClick={handleLogout} 
            className="w-full bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10 text-red-600 dark:text-red-500 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={18} /> Keluar dari Akun
          </button>
        </div>

      </div>
    </div>
  );
}