import { supabase } from "@/lib/supabase";

export const ChatService = {
  // Ambil semua pesan untuk inbox (Nanti kita filter di Hook)
  async getAllChats() {
    return await supabase
      .from("chats")
      .select("*")
      .order("created_at", { ascending: false }); // Urutkan dari yang paling baru
  },

  // Ambil pesan khusus untuk 1 ruangan saja
  async getRoomMessages(roomId: string) {
    return await supabase
      .from("chats")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true }); // Urutkan dari yang terlama ke terbaru (untuk dibaca dari atas ke bawah)
  },

  // Kirim pesan baru
  async sendMessage(roomId: string, senderId: string, message: string) {
    return await supabase.from("chats").insert([
      { room_id: roomId, sender_id: senderId, message }
    ]);
  }
};