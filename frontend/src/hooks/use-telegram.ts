import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { TelegramAccountStatus } from "@/types/telegram";

export function useTelegramStatus(cafeId: number | string) {
  return useQuery({
    queryKey: ["cafes", cafeId, "telegram"],
    queryFn: async () => {
      const { data } = await apiClient.get<TelegramAccountStatus>(endpoints.owner.telegram(cafeId));
      return data;
    },
    enabled: Boolean(cafeId),
    refetchInterval: (query) => (query.state.data?.status === "pending" ? 4_000 : false),
  });
}

export function useConnectTelegram(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<{ link_token: string; bot_deeplink_instructions: string }>(
        endpoints.owner.telegramConnect(cafeId)
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "telegram"] });
    },
  });
}

export function useDisconnectTelegram(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post(endpoints.owner.telegramDisconnect(cafeId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "telegram"] });
    },
  });
}
