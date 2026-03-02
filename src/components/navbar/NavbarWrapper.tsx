"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import UserNavbar from "./UserNavbar";
import MerchantNavbar from "./MerchantNavbar";

export default function NavbarWrapper() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        setRole(data?.role || 'user');
      } else {
        setRole('user');
      }
      setIsLoading(false);
    };

    checkUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkUserRole();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) return null; 

  return role === 'merchant' ? <MerchantNavbar /> : <UserNavbar />;
}