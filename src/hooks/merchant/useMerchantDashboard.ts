import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MerchantDashboardService } from "@/services/merchant/dashboard.service";

export function useMerchantDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await MerchantDashboardService.getDashboardStats();
      if (data) {
        setDashboardData(data);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await MerchantDashboardService.logout();
    router.push("/login");
  };

  return {
    dashboardData,
    isLoading,
    handleLogout
  };
}