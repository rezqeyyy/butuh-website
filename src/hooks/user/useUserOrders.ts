import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserOrderService } from "@/services/user/order.service";

export function useUserOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await UserOrderService.getMyOrders(user.id);
        if (!error && data) {
          setOrders(data);
        }
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  return {
    orders,
    isLoading
  };
}