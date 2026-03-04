"use client";

import { Code2, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMarketplace } from "@/hooks/user/home/card/useMarketplace";

const MerchantCard = ({ merchant }: { merchant: any }) => (
  <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-14 h-14 bg-linear-to-br from-[#1a56db] to-indigo-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner uppercase overflow-hidden shrink-0">
        {merchant.profiles?.avatar_url ? (
          <img src={merchant.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          merchant.profiles?.full_name?.charAt(0) || "D"
        )}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#1a56db] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {merchant.profiles?.full_name || "Developer"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
          <Code2 className="w-3.5 h-3.5" /> {merchant.experience_years || 0} Tahun Pengalaman
        </p>
      </div>
    </div>
    
    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 flex-1 italic">
      &quot;{merchant.short_description || "Siap membantu mewujudkan website impian Anda."}&quot;
    </p>
    
    <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 flex items-center justify-between mt-auto">
      <div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">Harga Mulai</p>
        <p className="font-extrabold text-[#1a56db] dark:text-blue-400 text-lg">
          Rp {merchant.start_price?.toLocaleString("id-ID") || 0}
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 p-2.5 rounded-xl group-hover:bg-[#1a56db] group-hover:text-white dark:group-hover:bg-blue-600 transition-all shadow-sm">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export default function DeveloperSection() {
  const { merchants, isLoading } = useMarketplace();

  return (
    <section>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Code2 className="text-[#1a56db] dark:text-blue-500" /> Developer Kustom
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sewa ahli untuk membangun sistem spesifik sesuai permintaanmu.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin mb-3 text-[#1a56db] dark:text-blue-500" />
          <p className="font-medium">Memuat daftar developer...</p>
        </div>
      ) : merchants.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-[#111111] rounded-3xl border-2 border-dashed border-gray-200 dark:border-zinc-800 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada developer yang terdaftar di area ini.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {merchants.map((merchant) => (
            <Link href={`/developer/${merchant.id}`} key={merchant.id} className="block outline-none">
              <MerchantCard merchant={merchant} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}