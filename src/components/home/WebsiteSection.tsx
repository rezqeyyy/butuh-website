"use client";

import { Monitor, LayoutTemplate, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWebsite } from "@/hooks/user/morewebsite/website/useWebsite";

const WebsiteCard = ({ website }: { website: any }) => (
  <div className="bg-white dark:bg-[#111111] rounded-3xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer">
    <div className={`h-40 w-full bg-linear-to-br ${website.color} relative p-5 flex flex-col justify-end overflow-hidden`}>
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30">
        {website.type}
      </div>
      <Monitor className="text-white/20 w-24 h-24 absolute -right-4 -bottom-4 transform -rotate-12" />
    </div>
    
    <div className="p-6 flex flex-col flex-1">
      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#1a56db] dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
        {website.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
        {website.desc}
      </p>
      
      <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 flex items-center justify-between mt-auto">
        <div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">Harga Beli</p>
          <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">
            Rp {website.price?.toLocaleString("id-ID") || 0}
          </p>
        </div>
        <div className="bg-[#1a56db] hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95">
          <ShoppingCart className="w-5 h-5" />
        </div>
      </div>
    </div>
  </div>
);

export default function WebsiteSection() {
  const { website, loading } = useWebsite();
  const router = useRouter();

  if (loading) return null; // Bisa diganti dengan skeleton loading jika mau

  return (
    <section>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutTemplate className="text-emerald-500" /> Website Siap Pakai
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Beli desain jadi, langsung online hari ini juga.</p>
        </div>
        <button onClick={() => router.push('/morewebsite')} className="hidden md:flex text-[#1a56db] dark:text-blue-400 font-bold hover:underline items-center text-sm cursor-pointer">
          Lihat Semua
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {website.map((web: any) => (
          <div key={web.id} onClick={() => router.push(`/morewebsite/${web.id}`)}>
            <WebsiteCard website={web} />
          </div>
        ))}
      </div>
    </section>
  );
}