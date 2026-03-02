import { supabase } from "@/lib/supabase";

export const MerchantDashboardService = {
  async getDashboardStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // 1. Ambil nama & avatar
    const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();

    // 2. Ambil semua pesanan untuk dihitung statistiknya
    const { data: orders } = await supabase.from("gig_orders").select("status, services(price)").eq("merchant_id", user.id);

    let totalIncome = 0;
    let activeOrders = 0;
    let completedOrders = 0;

    if (orders) {
      orders.forEach((order: any) => {
        if (order.status === 'selesai') {
          completedOrders++;
          totalIncome += order.services?.price || 0;
        } else {
          activeOrders++; // Menghitung yang pending & proses
        }
      });
    }

    return {
      user,
      profile,
      stats: {
        totalIncome,
        activeOrders,
        completedOrders
      }
    };
  },

  async logout() {
    return await supabase.auth.signOut();
  }
};