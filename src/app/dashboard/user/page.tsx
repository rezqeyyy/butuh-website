"use client";

import { ShoppingBag, Clock, CheckCircle, User, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
// Import logika dari folder hooks
import { useUserDashboard } from "@/hooks/user/useUserDashboard"; 

export default function UserDashboard() {
  // Panggil data dan fungsi dari custom hook
  const { orders, userName, isLoading, handleLogout } = useUserDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profil Header */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Halo, {userName || "Pengguna"}!</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Selamat datang di Dashboard Pelanggan.</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full md:w-auto flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-bold bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-6 py-3 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>

        {/* Tabel Pesanan */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/20">
            <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Riwayat Pesanan Saya</h2>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Kamu belum memesan jasa apapun.</p>
                <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-3 inline-block font-bold hover:underline">
                  Cari developer sekarang
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">
                      Order #{order.id?.substring(0, 8)} • {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{order.services?.title || "Layanan Tidak Diketahui"}</h3>
                    <p className="font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                      Rp {order.services?.price?.toLocaleString('id-ID') || 0}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 w-max ${
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 
                      order.status === 'proses' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    }`}>
                      {order.status === 'pending' ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      {order.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}