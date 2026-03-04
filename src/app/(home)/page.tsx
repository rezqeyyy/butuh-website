"use client";

import { Search } from "lucide-react";
import WebsiteSection from "@/components/home/WebsiteSection";
import DeveloperSection from "@/components/home/DeveloperSection";

export default function MarketplaceHome() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* Header & Hero Section */}
      <section className="bg-[#1a56db] dark:bg-blue-950 text-white py-20 px-6 text-center transition-colors">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Wujudkan Website Impianmu
        </h1>
        <p className="text-blue-100 dark:text-blue-200 text-lg max-w-2xl mx-auto mb-10 font-medium">
          Beli website siap pakai yang langsung bisa digunakan, atau sewa developer ahli untuk bangun sistem sesuai kebutuhan khususmu.
        </p>
        
        <div className="max-w-2xl mx-auto flex bg-white dark:bg-[#111111] rounded-full overflow-hidden shadow-xl p-1.5 border border-white/20 dark:border-zinc-800 transition-colors">
          <div className="pl-5 flex items-center text-gray-400 dark:text-gray-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Cari website, developer, atau keahlian (React, Landing Page)..."
            className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white outline-none placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button className="bg-[#1a56db] dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all shrink-0">
            Cari
          </button>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">
        
        {/* Komponen Website Siap Pakai */}
        <WebsiteSection />

        {/* Komponen Developer Kustom */}
        <DeveloperSection />

      </div>
    </div>
  );
}