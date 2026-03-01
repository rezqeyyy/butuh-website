"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Search, ChevronRight, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Tipe data sementara untuk daftar chat
type ChatRoom = {
  id: string;
  interlocutor_name: string;
  interlocutor_avatar?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
};

export default function ChatInboxPage() {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Nanti ini diisi logika fetch daftar chat dari Supabase.
    // Sementara kita pakai data dummy agar UI-nya bisa dilihat dulu.
    const loadDummyChats = () => {
      setTimeout(() => {
        setChatRooms([
          {
            id: "dev-123",
            interlocutor_name: "RIZQI ASAN MASIKA",
            last_message: "Halo, untuk fitur payment gateway-nya mau pakai Midtrans atau Xendit?",
            last_message_time: "10:45",
            unread_count: 2,
          },
          {
            id: "dev-456",
            interlocutor_name: "Budi Santoso",
            last_message: "Website company profile-nya sudah selesai saya revisi ya mas, silakan dicek.",
            last_message_time: "Kemarin",
            unread_count: 0,
          },
          {
            id: "dev-789",
            interlocutor_name: "Siti Developer",
            last_message: "Baik, saya akan mulai pengerjaan desain UI/UX-nya besok pagi.",
            last_message_time: "Senin",
            unread_count: 0,
          }
        ]);
        setLoading(false);
      }, 1000); // Simulasi loading 1 detik
    };

    // Cek apakah user sudah login
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Silakan login untuk melihat daftar pesan.");
        router.push("/login");
      } else {
        loadDummyChats();
      }
    };

    checkAuth();
  }, [router]);

  const filteredChats = chatRooms.filter(chat => 
    chat.interlocutor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-6 pb-24 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="text-[#1a56db] dark:text-blue-500 w-8 h-8" /> 
            Pesan Saya
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Pantau semua obrolan dengan klien atau developer di sini.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 dark:focus:ring-blue-500/20 focus:border-[#1a56db] dark:focus:border-blue-500 transition-all shadow-sm"
            placeholder="Cari nama atau pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Chat List */}
        <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#1a56db] dark:text-blue-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Memuat pesan...</p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-50 dark:bg-zinc-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-zinc-800">
                <MessageSquare className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
              </div>
              <p className="text-gray-900 dark:text-white font-bold text-lg">Tidak ada pesan ditemukan</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Coba cari dengan kata kunci lain.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {filteredChats.map((chat) => (
                <Link 
                  href={`/chat/${chat.id}`} 
                  key={chat.id}
                  className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a56db] to-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-inner overflow-hidden">
                      {chat.interlocutor_avatar ? (
                        <img src={chat.interlocutor_avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        chat.interlocutor_name.charAt(0)
                      )}
                    </div>
                    {/* Badge Online/Unread (Opsional) */}
                    {chat.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-[#111111] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        {chat.unread_count}
                      </div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-base font-bold truncate pr-4 ${chat.unread_count > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                        {chat.interlocutor_name}
                      </h3>
                      <span className={`text-xs whitespace-nowrap ${chat.unread_count > 0 ? 'text-[#1a56db] dark:text-blue-400 font-bold' : 'text-gray-400 dark:text-gray-500 font-medium'}`}>
                        {chat.last_message_time}
                      </span>
                    </div>
                    <p className={`text-sm truncate pr-4 ${chat.unread_count > 0 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                      {chat.last_message}
                    </p>
                  </div>

                  {/* Chevron Icon */}
                  <div className="text-gray-300 dark:text-zinc-600 group-hover:text-[#1a56db] dark:group-hover:text-blue-400 transition-colors shrink-0">
                    <ChevronRight size={20} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}