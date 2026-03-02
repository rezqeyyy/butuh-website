import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MerchantOrderService } from "@/services/merchant/order.service";

export function useMerchantOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncomingOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await MerchantOrderService.getIncomingOrders(user.id);
      if (!error && data) {
        setOrders(data);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchIncomingOrders();
  }, []);

  const updateStatus = async (orderId: number, newStatus: string) => {
    const { error } = await MerchantOrderService.updateOrderStatus(orderId, newStatus);
    if (!error) {
      // Auto refresh tanpa alert berisik
      fetchIncomingOrders(); 
    }
  };

  return {
    orders,
    isLoading,
    updateStatus
  };
}