import { useState, useEffect } from "react";
import { HomeService } from "@/services/home/home.service";

export function useMarketplace() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const { data, error } = await HomeService.getMerchants();
      if (!error && data) {
        setMerchants(data);
      }
    } catch (err) {
      console.error("Gagal fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    merchants,
    isLoading
  };
}