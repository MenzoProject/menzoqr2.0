import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { PublicCafe } from "@/types/public-menu";

export function usePublicMenu(cafeSlug: string) {
  return useQuery({
    queryKey: ["public-menu", cafeSlug],
    queryFn: async () => {
      const { data } = await apiClient.get<PublicCafe>(endpoints.public.menu(cafeSlug));
      return data;
    },
    staleTime: 60_000,
  });
}
