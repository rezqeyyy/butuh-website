import { supabase } from "@/lib/supabase";

export const DeveloperService = {
  // Ambil detail gabungan dari tabel merchants dan profiles
  async getDeveloperDetail(developerId: string) {
    const { data: merchantData } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", developerId)
      .single();

    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", developerId)
      .single();

    if (merchantData && profileData) {
      return { ...merchantData, ...profileData };
    }
    
    return null;
  }
};