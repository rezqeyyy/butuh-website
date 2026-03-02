import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MerchantProfileService } from "@/services/merchant/profile.service";

export function useMerchantProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>({ full_name: "", avatar_url: "" });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const data = await MerchantProfileService.getProfile();
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

      // Panggil service untuk upload
      const publicUrl = await MerchantProfileService.uploadAvatar(userId, file);
      
      // Update state dengan URL baru
      setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));
    } catch (error: any) {
      alert("Gagal upload foto. Pastikan bucket 'avatars' sudah ada di Supabase.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) return;
    setSaveStatus('saving');
    
    await MerchantProfileService.updateProfile(userId, {
      full_name: profile.full_name,
      avatar_url: profile.avatar_url
    });

    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleLogout = async () => {
    await MerchantProfileService.logout();
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