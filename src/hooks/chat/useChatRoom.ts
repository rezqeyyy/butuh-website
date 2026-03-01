import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { ChatService } from "@/services/chat/chat.service";
import { useRouter } from "next/navigation";

export function useChatRoom(roomId: string) {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State baru untuk menyimpan nama lawan bicara
  const [roomName, setRoomName] = useState<string>(roomId); 

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUser(user);
      
      const { data } = await ChatService.getRoomMessages(roomId);
      
      if (data && data.length > 0) {
        setMessages(data);
        
        // Cari ID lawan bicara dari pesan yang ada
        const interlocutorMsg = data.find((msg) => msg.sender_id !== user.id);
        
        if (interlocutorMsg) {
          // Cari nama aslinya di tabel profiles
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", interlocutorMsg.sender_id)
            .single();
            
          if (profile?.full_name) {
            setRoomName(profile.full_name);
          }
        }
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
  }, [roomId, router]);

  // Auto-scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const msg = newMessage;
    setNewMessage(""); // Kosongkan input langsung

    await ChatService.sendMessage(roomId, currentUser.id, msg);
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    currentUser,
    loading,
    messagesEndRef,
    roomName, // Export state nama ruangannya
    handleSendMessage
  };
}