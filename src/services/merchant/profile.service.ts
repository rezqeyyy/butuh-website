import { supabase } from "@/lib/supabase";

export const MerchantProfileService = {
  // Ambil data profil
  async getProfile(userId: string) {
    return await supabase.from("merchants").select("*").eq("id", userId).single();
  },

  // Update profil
  async updateProfile(userId: string, data: any) {
    return await supabase.from("merchants").update({
      short_description: data.short_description,
      start_price: data.start_price,
      experience_years: data.experience_years
    }).eq("id", userId);
  }
};