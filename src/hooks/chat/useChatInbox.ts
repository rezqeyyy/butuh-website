import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChatService } from "@/services/chat/chat.service";
import { useRouter } from "next/navigation";

export function useChatInbox() {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUser(user);

    const { data: allChats } = await ChatService.getAllChats();

    if (allChats) {
      const groupedRooms: Record<string, any> = {};

      allChats.forEach((chat) => {
        // 1. Coba cari ID lawan bicara dari pengirim pesan (kalau dia udah balas)
        let targetId = chat.sender_id !== user.id ? chat.sender_id : null;

        // 2. 💡 TRIK PINTAR: Kalau targetId masih null (karena dia belum balas), 
        // kita akali dengan MENGESKTRAK ID dari nama ruangan!
        if (!targetId && chat.room_id) {
          const roomIdStr = String(chat.room_id);
          
          if (roomIdStr.includes('_')) {
            // Room format baru yang aman (uuidKamu_uuidDeveloper)
            const parts = roomIdStr.split('_');
            targetId = parts[0] === user.id ? parts[1] : parts[0];
          } else if (roomIdStr.length > 20 && roomIdStr !== user.id && roomIdStr !== "null") {
            // Fallback untuk room format lama (yang nama ruangannya cuma UUID developer doang)
            targetId = roomIdStr;
          }
        }

        if (!groupedRooms[chat.room_id]) {
          const date = new Date(chat.created_at);
          const timeString = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

          groupedRooms[chat.room_id] = {
            id: chat.room_id,
            last_message: chat.message,
            last_message_time: timeString,
            timestamp: date.getTime(), 
            interlocutor_id: targetId, // Simpan targetId yang udah kita ekstrak
            interlocutor_name: String(chat.room_id) // Default: Nama ruangannya dulu
          };
        } else {
          // Kalau tadi inter_id nya belum ketemu, coba diupdate
          if (!groupedRooms[chat.room_id].interlocutor_id && targetId) {
            groupedRooms[chat.room_id].interlocutor_id = targetId;
          }
        }
      });

      const roomsArray = Object.values(groupedRooms);
      
      const finalRooms = await Promise.all(roomsArray.map(async (room) => {
        // Kalau kita berhasil dapet ID lawan bicaranya, kita cari nama aslinya!
        if (room.interlocutor_id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", room.interlocutor_id)
            .single();
            
          if (profile?.full_name) {
            room.interlocutor_name = profile.full_name; // Ganti ID panjang dengan nama asli
          }
        }
        return room;
      }));

      finalRooms.sort((a, b) => b.timestamp - a.timestamp);
      setChatRooms(finalRooms);
    }
    setLoading(false);
  };

  const filteredChats = chatRooms.filter(chat => 
    chat.interlocutor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    filteredChats,
    loading,
    searchQuery,
    setSearchQuery,
    currentUser
  };
}