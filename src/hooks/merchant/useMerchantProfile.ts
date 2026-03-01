import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { MerchantProfileService } from "@/services/merchant/profile.service";

export function useMerchantProfile() {
  const [merchantData, setMerchantData] = useState<any>({
    short_description: "",
    start_price: 0,
    experience_years: 0,
    total_projects: 0
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await MerchantProfileService.getProfile(user.id);
      if (data) setMerchantData(data);
    }
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    setSaveStatus('saving');
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await MerchantProfileService.updateProfile(user.id, merchantData);
      
      if (error) {
        setSaveStatus('error');
      } else {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }
  };

  return {
    merchantData,
    setMerchantData,
    loading,
    saveStatus,
    handleUpdateProfile
  };
}