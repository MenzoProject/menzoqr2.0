import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { toFormData } from "@/lib/form-data";
import type { Dish } from "@/types/menu";

export interface DishMutationInput {
  name: string;
  description?: string;
  price: number;
  is_active?: boolean;
  is_available?: boolean;
  is_popular?: boolean;
  tags?: string[];
  image?: File | null;
  variants?: { id?: number; name: string; price_modifier: number }[];
  addons?: { id?: number; name: string; price: number; is_active?: boolean }[];
}

export function useCreateDish(cafeId: number | string, categoryId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: DishMutationInput) => {
      const formData = toFormData({ ...values });
      const { data } = await apiClient.post<Dish>(endpoints.owner.dishes(cafeId, categoryId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "categories"] });
    },
  });
}

export function useUpdateDish(cafeId: number | string, categoryId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dishId, values }: { dishId: number; values: DishMutationInput }) => {
      const formData = toFormData({ ...values, _method: "PATCH" });
      const { data } = await apiClient.post<Dish>(
        endpoints.owner.dish(cafeId, categoryId, dishId),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "categories"] });
    },
  });
}

export function useDeleteDish(cafeId: number | string, categoryId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dishId: number) => {
      await apiClient.delete(endpoints.owner.dish(cafeId, categoryId, dishId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "categories"] });
    },
  });
}
