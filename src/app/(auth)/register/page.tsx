"use client";

import { UserPlus, Code, User, Loader2 } from "lucide-react";
import Link from "next/link";
// Import logika dari folder hooks
import { useRegister } from "@/hooks/auth/useRegister"; 

export default function RegisterPage() {
  // Keluarkan state dan fungsi dari custom hook
  const { formData, isLoading, handleChange, handleRegister } = useRegister();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#111111] p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 transition-colors">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <UserPlus className="w-8 h-8 text-[#1a56db] dark:text-blue-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Buat Akun Baru</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">Bergabunglah dengan marketplace website kami</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Nama Lengkap</label>
            <input 
              type="text" 
              name="fullName" 
              required 
              value={formData.fullName} 
              onChange={handleChange} 
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-4 focus:ring-[#1a56db]/10 dark:focus:ring-blue-500/20 focus:border-[#1a56db] dark:focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white font-medium placeholder-gray-400" 
              placeholder="John Doe" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-4 focus:ring-[#1a56db]/10 dark:focus:ring-blue-500/20 focus:border-[#1a56db] dark:focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white font-medium placeholder-gray-400" 
              placeholder="nama@email.com" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-4 focus:ring-[#1a56db]/10 dark:focus:ring-blue-500/20 focus:border-[#1a56db] dark:focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white font-medium placeholder-gray-400" 
              placeholder="Minimal 6 karakter" 
              minLength={6} 
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Saya mendaftar sebagai:</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Pilihan Pencari Jasa */}
              <label className={`border-2 p-4 rounded-xl flex flex-col items-center cursor-pointer transition-all ${
                formData.role === 'user' 
                  ? 'border-[#1a56db] dark:border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-[#1a56db] dark:text-blue-400 shadow-sm' 
                  : 'border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
              }`}>
                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="hidden" />
                <User className="w-6 h-6 mb-2" />
                <span className="text-sm font-bold">Pencari Jasa</span>
              </label>
              
              {/* Pilihan Developer */}
              <label className={`border-2 p-4 rounded-xl flex flex-col items-center cursor-pointer transition-all ${
                formData.role === 'merchant' 
                  ? 'border-[#1a56db] dark:border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-[#1a56db] dark:text-blue-400 shadow-sm' 
                  : 'border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
              }`}>
                <input type="radio" name="role" value="merchant" checked={formData.role === 'merchant'} onChange={handleChange} className="hidden" />
                <Code className="w-6 h-6 mb-2" />
                <span className="text-sm font-bold">Developer</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-[#1a56db] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all mt-6 shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar Sekarang"}
          </button>
        </form>
        
        <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400 font-medium">
          Sudah punya akun? <Link href="/login" className="text-[#1a56db] dark:text-blue-400 font-bold hover:underline">Login di sini</Link>
        </p>

      </div>
    </div>
  );
}