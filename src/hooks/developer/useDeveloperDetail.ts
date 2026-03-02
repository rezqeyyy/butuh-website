import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DeveloperService } from "@/services/developer/developer.service";

export function useDeveloperDetail(developerId: string) {
  const router = useRouter();
  const [developer, setDeveloper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!developerId) return;

    const fetchDetail = async () => {
      const data = await DeveloperService.getDeveloperDetail(developerId);
      if (data) setDeveloper(data);
      setLoading(false);
    };

    fetchDetail();
  }, [developerId]);

  const handleChat = async () => {
    setIsProcessing(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Silakan login terlebih dahulu untuk mengirim pesan.");
      router.push("/login");
      setIsProcessing(false);
      return;
    }

    // Arahkan langsung ke ruang chat dengan developer ini
    router.push(`/chat/${developerId}`);
  };

  const handleOrder = async () => {
    setIsProcessing(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Silakan login terlebih dahulu untuk memesan jasa.");
      router.push("/login");
      setIsProcessing(false);
      return;
    }

    // Arahkan ke halaman checkout
    router.push(`/checkout/${developerId}`);
  };

  return {
    developer,
    loading,
    isProcessing,
    handleChat,
    handleOrder
  };
}