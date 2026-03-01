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
        // Tadi di sini ada kode buat ngebasmi "null", sekarang UDAH GUA HAPUS biar chatnya balik!

        if (!groupedRooms[chat.room_id]) {
          const date = new Date(chat.created_at);
          const timeString = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

          groupedRooms[chat.room_id] = {
            id: chat.room_id,
            last_message: chat.message,
            last_message_time: timeString,
            timestamp: date.getTime(), 
            interlocutor_id: chat.sender_id !== user.id ? chat.sender_id : null,
            // NAMA DEFAULT: Langsung pake nama room-nya aja TANPA embel-embel "Room:"
            interlocutor_name: String(chat.room_id)
          };
        } else {
          if (!groupedRooms[chat.room_id].interlocutor_id && chat.sender_id !== user.id) {
            groupedRooms[chat.room_id].interlocutor_id = chat.sender_id;
          }
        }
      });

      const roomsArray = Object.values(groupedRooms);
      
      const finalRooms = await Promise.all(roomsArray.map(async (room) => {
        // Kalau ketemu ID lawan bicara, kita ganti nama room-nya jadi nama asli orangnya
        if (room.interlocutor_id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", room.interlocutor_id)
            .single();
            
          if (profile?.full_name) {
            room.interlocutor_name = profile.full_name;
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