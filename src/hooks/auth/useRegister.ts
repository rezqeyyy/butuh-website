import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth/auth.service";

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user", // Default role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Panggil fungsi Register dari Service
      await AuthService.registerWithPassword(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role
      );

      alert("Registrasi berhasil! Silakan login.");
      router.push("/login");

    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleRegister
  };
}