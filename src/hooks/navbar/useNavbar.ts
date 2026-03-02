import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { NavbarService } from "@/services/navbar/navbar.service";

export function useNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUserData = async () => {
    const { user, profile } = await NavbarService.getUserProfile();
    setUser(user);
    setProfile(profile);
  };

  useEffect(() => {
    // 1. Cek Dark Mode bawaan browser/sistem
    if (document.documentElement.classList.contains("dark")) setIsDark(true);

    // 2. Tarik data profil saat pertama kali render
    fetchUserData();

    // 3. 🚀 PASANG TELINGA PENDENGAR (Untuk Real-Time Avatar & Nama)
    const handleProfileUpdate = () => {
      fetchUserData(); // Tarik data baru otomatis
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);

    // 4. Listener bawaan Supabase (Login/Logout otomatis)
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserData();
    });

    // 5. Tutup dropdown kalau area luar diklik
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Bersihkan semua listener saat pindah halaman / komponen dibongkar
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      authListener.subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    await NavbarService.logout();
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return {
    user,
    profile,
    isDark,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    toggleTheme,
    handleLogout
  };
}