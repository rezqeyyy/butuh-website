import { supabase } from "@/lib/supabase";

export const HomeService = {
  // Mengambil daftar developer (merchant) beserta profilnya
  async getMerchants() {
    return await supabase
      .from("merchants")
      .select(`*, profiles ( full_name, role, avatar_url )`);
  }
};