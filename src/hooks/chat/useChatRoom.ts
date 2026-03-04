import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { ChatService } from "@/services/chat/chat.service";
import { useRouter, useSearchParams } from "next/navigation";

export function useChatRoom(roomId: string) {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const urlTargetId = searchParams.get("targetId"); 

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [roomName, setRoomName] = useState<string>("Memuat..."); 

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUser(user);
      
      // Ambil riwayat chat
      const { data } = await ChatService.getRoomMessages(roomId);
      if (data && data.length > 0) {
        setMessages(data);
      }
      
      // --- LOGIKA PINTAR MENCARI NAMA LAWAN BICARA ---
      let finalTargetId = urlTargetId;

      // 1. Kalau dari parameter URL kosong, EKSTRAK dari ID Ruangan (format uuidKamu_uuidDia)
      if (!finalTargetId && roomId.includes('_')) {
        const parts = roomId.split('_');
        // Ambil UUID yang BUKAN milik kita
        finalTargetId = parts[0] === user.id ? parts[1] : parts[0];
      } 
      // 2. Fallback untuk chat format jadul
      else if (!finalTargetId && roomId.length > 20 && roomId !== user.id && roomId !== "null") {
        finalTargetId = roomId;
      }

      // 3. Kalau masih kosong juga, coba cari dari riwayat pesan (siapa tahu dia udah balas)
      if (!finalTargetId && data && data.length > 0) {
        const interlocutorMsg = data.find((msg) => msg.sender_id !== user.id);
        if (interlocutorMsg) finalTargetId = interlocutorMsg.sender_id;
      }

      // 4. Tarik nama aslinya dari Database!
      if (finalTargetId) {
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", finalTargetId).single();
        
        if (profile?.full_name) {
          setRoomName(profile.full_name);
        } else {
          // Kalau profilnya dihapus
          setRoomName(roomId.includes('_') ? "Pengguna Tidak Dikenal" : roomId);
        }
      } else {
        // Fallback terakhir banget
        setRoomName(roomId.includes('_') ? "Pengguna Tidak Dikenal" : roomId);
      }
      
      setLoading(false);
    };

    loadData();

    // Listener Realtime Supabase
    const channel = supabase
      .channel(`room_${roomId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chats" }, (payload) => {
        if (payload.new.room_id === roomId) {
          setMessages((prev) => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId, urlTargetId, router]); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const msg = newMessage;
    setNewMessage("");

    await ChatService.sendMessage(roomId, currentUser.id, msg);
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    currentUser,
    loading,
    messagesEndRef,
    roomName,
    handleSendMessage
  };
}