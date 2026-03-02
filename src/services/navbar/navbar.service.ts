import { supabase } from "@/lib/supabase";

export const NavbarService = {
  // Ambil data user yang sedang login beserta profilnya
  async getUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { user: null, profile: null };

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return { user, profile };
  },

  // Fungsi Logout
  async logout() {
    return await supabase.auth.signOut();
  }
};