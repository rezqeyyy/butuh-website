import { supabase } from "@/lib/supabase";

export const AuthService = {
  // 1. Fungsi untuk Login
  async loginWithPassword(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  // 2. Fungsi untuk Register (SUDAH DISESUAIKAN)
  async registerWithPassword(email: string, password: string, fullName: string, role: string) {
    // A. Daftarkan user ke Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    
    const userId = authData.user?.id;
    if (!userId) throw new Error("Gagal mendapatkan ID User");

    // B. Simpan data ke tabel profiles
    const { error: profileError } = await supabase.from("profiles").insert([
      { id: userId, full_name: fullName, role: role }
    ]);

    if (profileError) throw profileError;

    // C. Jika rolenya merchant, buatkan juga data kosong di tabel merchants
    if (role === "merchant") {
      const { error: merchantError } = await supabase.from("merchants").insert([
        { id: userId }
      ]);
      if (merchantError) throw merchantError;
    }

    return { data: authData, error: null };
  },

  // 3. Fungsi untuk mengecek role user
  async getUserRole(userId: string) {
    return await supabase.from("profiles").select("role").eq("id", userId).single();
  }
};