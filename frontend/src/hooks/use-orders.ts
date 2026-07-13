import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Order, OrderStatus } from "@/types/order";

interface PaginatedOrders {
  data: Order[];
  meta: { current_page: number; last_page: number; total: number };
}

export function useOrders(cafeId: number | string, page = 1) {
  return useQuery({
    queryKey: ["cafes", cafeId, "orders", page],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedOrders>(endpoints.owner.orders(cafeId), {
        params: { per_page: 50, page },
      });
      return data;
    },
    enabled: Boolean(cafeId),
    refetchInterval: 15_000,
  });
}

export function useUpdateOrderStatus(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: OrderStatus }) => {
      const { data } = await apiClient.patch<Order>(endpoints.owner.orderStatus(cafeId, orderId), {
        status,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "orders"] });
    },
  });
}
