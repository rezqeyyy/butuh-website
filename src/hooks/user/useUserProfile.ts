import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfileService } from "@/services/user/profile.service";

export function useUserProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>({ full_name: "", avatar_url: "" });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const data = await UserProfileService.getProfile();
    if (data?.user) {
      setUserId(data.user.id);
      if (data.profile) setProfile(data.profile);
    } else {
      router.push("/login");
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file || !userId) return;

      const publicUrl = await UserProfileService.uploadAvatar(userId, file);
      
      const { error } = await UserProfileService.updateProfile(userId, { avatar_url: publicUrl });
      if (error) throw error;

      setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));
      
      // 🚀 KIRIM SINYAL KE NAVBAR BAHWA FOTO BERUBAH
      window.dispatchEvent(new Event("profileUpdated"));

    } catch (error: any) {
      alert("Gagal mengunggah foto. Pastikan pengaturan bucket sudah benar.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) return;
    setSaveStatus('saving');
    
    const { error } = await UserProfileService.updateProfile(userId, {
      full_name: profile.full_name,
      avatar_url: profile.avatar_url
    });

    if (error) {
      setSaveStatus('error');
    } else {
      setSaveStatus('success');
      
      // 🚀 KIRIM SINYAL KE NAVBAR BAHWA NAMA BERUBAH
      window.dispatchEvent(new Event("profileUpdated"));

      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleLogout = async () => {
    await UserProfileService.logout();
    router.push("/login");
  };

  return {
    profile,
    setProfile,
    loading,
    uploading,
    saveStatus,
    handleAvatarUpload,
    handleUpdateProfile,
    handleLogout
  };
}