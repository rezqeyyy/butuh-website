import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth/auth.service";

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Panggil API Login dari folder services
      const { data: authData, error: authError } = await AuthService.loginWithPassword(
        formData.email,
        formData.password
      );

      if (authError) throw authError;

      const userId = authData.user.id;

      // 2. Cek Role dari folder services
      const { data: profile, error: profileError } = await AuthService.getUserRole(userId);

      if (profileError) throw profileError;

      // 3. Arahkan ke dashboard yang sesuai
      if (profile.role === "merchant") {
        router.push("/dashboard/merchant");
      } else {
        router.push("/dashboard/user"); 
      }

    } catch (error: any) {
      alert("Gagal Login: Email atau password salah!");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleLogin
  };
}