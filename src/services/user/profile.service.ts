import { supabase } from "@/lib/supabase";

export const UserProfileService = {
  // Ambil data user beserta profilnya
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return { user, profile: data };
  },

  // Upload foto ke bucket Supabase
  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${userId}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  },

  // Update profil di database
  async updateProfile(userId: string, data: { full_name?: string, avatar_url?: string }) {
    return await supabase.from("profiles").update(data).eq("id", userId);
  },

  // Fungsi Logout
  async logout() {
    return await supabase.auth.signOut();
  }
};