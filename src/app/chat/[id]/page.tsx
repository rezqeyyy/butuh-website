"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Send, ArrowLeft, Loader2, MoreVertical, User } from "lucide-react";

// Tipe data untuk TypeScript
type ChatMessage = {
  id: number;
  created_at: string;
  sender_id: string; // ID user yang mengirim
  message: string;
  room_id: string;   // ID ruangan chat
};

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string; // Menangkap ID dari URL (misal: dev-123)

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Cek User yang sedang login
    const checkUserAndFetchMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Sesi kamu telah habis. Silakan login kembali.");
        router.push("/login");
        return;
      }
      setCurrentUser(user);
      
      // Ambil histori pesan khusus untuk ruangan ini
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
      setLoading(false);
    };

    checkUserAndFetchMessages();

    // 2. Aktifkan Supabase Realtime Listener khusus tabel 'chats'
    const channel = supabase
      .channel(`chat_room_${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chats" },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          // Hanya masukkan pesan ke layar JIKA room_id-nya cocok dengan ruangan ini
          if (newMsg.room_id === roomId) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    // Cleanup listener saat keluar dari halaman
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, router]);

  // Auto-scroll ke pesan paling bawah setiap ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const messageToSend = newMessage;
    setNewMessage(""); // Kosongkan input langsung (Optimistic UI)

    // Kirim ke database Supabase
    const { error } = await supabase.from("chats").insert([
      { 
        room_id: roomId, 
        sender_id: currentUser.id, 
        message: messageToSend 
      },
    ]);

    if (error) {
      alert("Gagal mengirim pesan! Pastikan tabel 'chats' memiliki kolom 'room_id' dan 'sender_id'.");
      console.error("Error kirim pesan:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a56db]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col transition-colors duration-300">
      
      {/* 1. Header (Sticky di atas) */}
      <header className="sticky top-0 z-20 bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/chat')} 
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1a56db] to-indigo-500 text-white flex items-center justify-center font-bold text-sm">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-sm md:text-base leading-tight">
                Ruang Diskusi
              </h2>
              <p className="text-xs text-emerald-500 font-medium">Online</p>
            </div>
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2">
          <MoreVertical size={20} />
        </button>
      </header>

      {/* 2. Area Pesan (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-3 pt-20">
            <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-full">
              <Send className="w-8 h-8 text-gray-300 dark:text-zinc-600 ml-1" />
            </div>
            <p className="font-medium text-sm">Belum ada pesan. Mulai sapa sekarang!</p>
          </div>
        ) : (
          messages.map((msg) => {
            // Tentukan apakah pesan ini milik user yang sedang login
            const isMe = msg.sender_id === currentUser?.id;
            
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${
                  isMe 
                    ? "bg-[#1a56db] text-white rounded-tr-sm" 
                    : "bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-gray-900 dark:text-white rounded-tl-sm"
                }`}>
                  <p className="text-[15px] leading-relaxed break-words">{msg.message}</p>
                  <p className={`text-[10px] mt-1.5 text-right font-medium ${isMe ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}>
                    {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} /> {/* Penahan autoscroll */}
      </div>

      {/* 3. Input Pesan (Sticky di bawah) */}
      <div className="sticky bottom-0 bg-gray-50 dark:bg-[#0a0a0a] p-4 border-t border-gray-200 dark:border-zinc-800">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 items-end">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              // Kirim pakai tombol Enter (tanpa Shift)
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as any);
              }
            }}
            placeholder="Ketik pesan..."
            rows={1}
            className="flex-1 max-h-32 min-h-[44px] resize-none px-4 py-3 bg-white dark:bg-[#111111] border border-gray-200 dark:border-zinc-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 dark:focus:ring-blue-500/20 focus:border-[#1a56db] transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="shrink-0 w-12 h-12 bg-[#1a56db] hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-zinc-800 text-white rounded-full flex items-center justify-center transition-all disabled:cursor-not-allowed active:scale-95 shadow-md shadow-blue-500/20"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
}