import { supabase } from "@/lib/supabase";

export const MerchantOrderService = {
  // Ambil semua pesanan masuk untuk merchant ini
  async getIncomingOrders(merchantId: string) {
    return await supabase
      .from("gig_orders")
      .select(`*, profiles!user_id(full_name), services(title, price)`)
      .eq("merchant_id", merchantId)
      .order("created_at", { ascending: false });
  },

  // Perbarui status pesanan (proses / selesai)
  async updateOrderStatus(orderId: number, newStatus: string) {
    return await supabase
      .from("gig_orders")
      .update({ status: newStatus })
      .eq("id", orderId);
  }
};