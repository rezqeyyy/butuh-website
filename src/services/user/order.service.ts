import { supabase } from "@/lib/supabase";

export const UserOrderService = {
  // Ambil semua pesanan proyek untuk user ini
  async getMyOrders(userId: string) {
    return await supabase
      .from("gig_orders")
      .select(`*, services(title, price)`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  }
};