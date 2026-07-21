import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { toFormData } from "@/lib/form-data";
import type { Banner } from "@/types/banner";

export interface BannerMutationInput {
  title?: string;
  subtitle?: string;
  is_active?: boolean;
  sort_order?: number;
  image?: File | null;
}

export function useBanners(cafeId: number | string) {
  return useQuery({
    queryKey: ["cafes", cafeId, "banners"],
    queryFn: async () => {
      const { data } = await apiClient.get<Banner[]>(endpoints.owner.banners(cafeId));
      return data;
    },
    enabled: Boolean(cafeId),
  });
}

export function useCreateBanner(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: BannerMutationInput) => {
      const formData = toFormData({ ...values });
      const { data } = await apiClient.post<Banner>(endpoints.owner.banners(cafeId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "banners"] });
    },
  });
}

export function useUpdateBanner(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bannerId, values }: { bannerId: number; values: BannerMutationInput }) => {
      const formData = toFormData({ ...values, _method: "PATCH" });
      const { data } = await apiClient.post<Banner>(endpoints.owner.banner(cafeId, bannerId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "banners"] });
    },
  });
}

export function useDeleteBanner(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bannerId: number) => {
      await apiClient.delete(endpoints.owner.banner(cafeId, bannerId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "banners"] });
    },
  });
}
