"use client";

import { User, Camera, LogOut, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
// Import logika dari folder hooks
import { useMerchantProfile } from "@/hooks/merchant/useMerchantProfile";

export default function MerchantProfilePage() {
  // Keluarkan state dan fungsi dari custom hook
  const { 
    profile, setProfile, loading, uploading, saveStatus, 
    handleAvatarUpload, handleUpdateProfile, handleLogout 
  } = useMerchantProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
        <Loader2 className="animate-spin text-zinc-500 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pt-12 pb-24 transition-colors duration-300">
      <div className="max-w-md mx-auto space-y-8 px-6">
        
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Akun Developer</h1>
          <ShieldCheck className="text-emerald-500" size={24} />
        </div>

        <div className="flex flex-col items-center gap-5 mt-8">
          <div className="relative group">
            <div className="w-32 h-32 bg-zinc-900 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border-4 border-white dark:border-[#0a0a0a] shadow-xl overflow-hidden text-white transition-all transform rotate-3 hover:rotate-0 duration-300">
               {profile.avatar_url ? (
                 <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <User size={56} className="text-zinc-500" />
               )}
               {uploading && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                   <Loader2 className="animate-spin text-white w-8 h-8" />
                 </div>
               )}
            </div>
            
            <label className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-800 p-2.5 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:scale-110 transition-transform">
              <Camera size={18} className="text-zinc-700 dark:text-zinc-300" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="space-y-5 pt-6">
          <div className="bg-white dark:bg-[#111111] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors">
             <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Nama Tampilan Developer</label>
             <input 
               className="w-full mt-2 font-semibold text-lg outline-none bg-transparent text-zinc-900 dark:text-white" 
               value={profile.full_name || ""} 
               onChange={(e) => setProfile({...profile, full_name: e.target.value})} 
               placeholder="Nama asli atau alias studiamu..."
             />
          </div>

          <button 
            onClick={handleUpdateProfile}
            disabled={saveStatus === 'saving'}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-xl font-bold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all flex justify-center items-center gap-2"
          >
            {saveStatus === 'saving' ? <Loader2 className="animate-spin w-5 h-5" /> : "Simpan Profil Developer"}
          </button>
          
          {saveStatus === 'success' && (
            <p className="text-center text-sm font-bold text-emerald-500 flex justify-center gap-1 animate-in fade-in">
              <CheckCircle2 size={16}/> Tersimpan
            </p>
          )}

          <button 
            onClick={handleLogout} 
            className="w-full border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all mt-4"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>

      </div>
    </div>
  );
}