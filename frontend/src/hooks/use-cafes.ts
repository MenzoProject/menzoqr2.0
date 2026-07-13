import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Cafe } from "@/types/cafe";
import type { CafeFormValues } from "@/lib/validation/cafe";

export function useCafes() {
  return useQuery({
    queryKey: ["cafes"],
    queryFn: async () => {
      const { data } = await apiClient.get<Cafe[]>(endpoints.owner.cafes);
      return data;
    },
  });
}

export function useCafe(cafeId: number | string | undefined) {
  return useQuery({
    queryKey: ["cafes", cafeId],
    queryFn: async () => {
      const { data } = await apiClient.get<Cafe>(endpoints.owner.cafe(cafeId!));
      return data;
    },
    enabled: Boolean(cafeId),
  });
}

export function useCreateCafe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CafeFormValues) => {
      const { data } = await apiClient.post<Cafe>(endpoints.owner.cafes, values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
    },
  });
}

export function useUpdateCafe(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<CafeFormValues> & { is_active?: boolean }) => {
      const { data } = await apiClient.patch<Cafe>(endpoints.owner.cafe(cafeId), values);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
      queryClient.setQueryData(["cafes", cafeId], data);
    },
  });
}

export function useDeleteCafe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cafeId: number | string) => {
      await apiClient.delete(endpoints.owner.cafe(cafeId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
    },
  });
}
