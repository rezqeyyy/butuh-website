import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UserDashboardService } from "@/services/user/dashboard.service";

export function useUserDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserAndFetchOrders();
  }, []);

  const checkUserAndFetchOrders = async () => {
    // 1. Pastikan user sudah login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // 2. Ambil nama user dari profil
    const { data: profile } = await UserDashboardService.getUserProfile(user.id);
    if (profile) setUserName(profile.full_name);

    // 3. Ambil riwayat pesanan
    const { data: ordersData, error } = await UserDashboardService.getUserOrders(user.id);
    if (!error && ordersData) {
      setOrders(ordersData);
    }
    
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await UserDashboardService.logout();
    router.push("/login");
  };

  return {
    orders,
    userName,
    isLoading,
    handleLogout
  };
}