import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { toFormData } from "@/lib/form-data";
import type { ComboOffer } from "@/types/combo-offer";

export interface ComboOfferMutationInput {
  title: string;
  description?: string;
  price: number;
  original_price?: number;
  is_active?: boolean;
  sort_order?: number;
  image?: File | null;
}

export function useComboOffers(cafeId: number | string) {
  return useQuery({
    queryKey: ["cafes", cafeId, "combo-offers"],
    queryFn: async () => {
      const { data } = await apiClient.get<ComboOffer[]>(endpoints.owner.comboOffers(cafeId));
      return data;
    },
    enabled: Boolean(cafeId),
  });
}

export function useCreateComboOffer(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ComboOfferMutationInput) => {
      const formData = toFormData({ ...values });
      const { data } = await apiClient.post<ComboOffer>(endpoints.owner.comboOffers(cafeId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "combo-offers"] });
    },
  });
}

export function useUpdateComboOffer(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      comboOfferId,
      values,
    }: {
      comboOfferId: number;
      values: ComboOfferMutationInput;
    }) => {
      const formData = toFormData({ ...values, _method: "PATCH" });
      const { data } = await apiClient.post<ComboOffer>(
        endpoints.owner.comboOffer(cafeId, comboOfferId),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "combo-offers"] });
    },
  });
}

export function useDeleteComboOffer(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comboOfferId: number) => {
      await apiClient.delete(endpoints.owner.comboOffer(cafeId, comboOfferId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "combo-offers"] });
    },
  });
}
