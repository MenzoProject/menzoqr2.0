import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Category } from "@/types/menu";
import type { CategoryFormValues } from "@/lib/validation/menu";

export function useCategories(cafeId: number | string) {
  return useQuery({
    queryKey: ["cafes", cafeId, "categories"],
    queryFn: async () => {
      const { data } = await apiClient.get<Category[]>(endpoints.owner.categories(cafeId));
      return data;
    },
    enabled: Boolean(cafeId),
  });
}

export function useCreateCategory(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const { data } = await apiClient.post<Category>(endpoints.owner.categories(cafeId), values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "categories"] });
    },
  });
}

export function useUpdateCategory(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      values,
    }: {
      categoryId: number;
      values: Partial<CategoryFormValues>;
    }) => {
      const { data } = await apiClient.patch<Category>(
        endpoints.owner.category(cafeId, categoryId),
        values
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "categories"] });
    },
  });
}

export function useDeleteCategory(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: number) => {
      await apiClient.delete(endpoints.owner.category(cafeId, categoryId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "categories"] });
    },
  });
}
