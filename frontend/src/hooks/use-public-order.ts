import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Order, OrderType } from "@/types/order";
import type { CartItem } from "@/types/cart";

interface CreatePublicOrderInput {
  type: OrderType;
  table_id?: number;
  customer_name: string;
  customer_phone?: string;
  comment?: string;
  items: CartItem[];
}

function serializeItems(items: CartItem[]) {
  return items.map((item) => ({
    dish_id: item.dishId,
    dish_variant_id: item.variant?.id,
    quantity: item.quantity,
    comment: item.comment || undefined,
    addons: item.addons.map((addon) => ({ dish_addon_id: addon.id })),
  }));
}

export function useCreatePublicOrder(cafeSlug: string) {
  return useMutation({
    mutationFn: async (input: CreatePublicOrderInput) => {
      const { data } = await apiClient.post<Order>(endpoints.public.orders(cafeSlug), {
        type: input.type,
        table_id: input.table_id,
        customer_name: input.customer_name,
        customer_phone: input.customer_phone,
        comment: input.comment,
        items: serializeItems(input.items),
      });
      return data;
    },
  });
}

export function usePublicOrderStatus(orderNumber: string | undefined) {
  return useQuery({
    queryKey: ["public-order-status", orderNumber],
    queryFn: async () => {
      const { data } = await apiClient.get<Order>(endpoints.public.orderStatus(orderNumber!));
      return data;
    },
    enabled: Boolean(orderNumber),
    refetchInterval: (query) =>
      query.state.data && ["delivered", "cancelled"].includes(query.state.data.status) ? false : 5_000,
  });
}
