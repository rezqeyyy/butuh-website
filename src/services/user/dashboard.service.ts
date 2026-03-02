import { supabase } from "@/lib/supabase";

export const UserDashboardService = {
  // Ambil nama user
  async getUserProfile(userId: string) {
    return await supabase.from("profiles").select("full_name").eq("id", userId).single();
  },

  // Ambil riwayat pesanan (order)
  async getUserOrders(userId: string) {
    return await supabase
      .from("gig_orders")
      .select(`
        id, status, created_at,
        services ( title, price )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  // Fungsi Logout
  async logout() {
    return await supabase.auth.signOut();
  }
};