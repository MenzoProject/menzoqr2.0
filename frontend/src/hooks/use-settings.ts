import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { toFormData } from "@/lib/form-data";
import type { Cafe } from "@/types/cafe";
import type { SettingsFormValues } from "@/lib/validation/settings";

export function useCafeSettings(cafeId: number | string) {
  return useQuery({
    queryKey: ["cafes", cafeId, "settings"],
    queryFn: async () => {
      const { data } = await apiClient.get<Cafe>(endpoints.owner.settings(cafeId));
      return data;
    },
    enabled: Boolean(cafeId),
  });
}

export function useUpdateCafeSettings(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: SettingsFormValues & { logo?: File | null }) => {
      const formData = toFormData({ ...values, _method: "PATCH" });
      const { data } = await apiClient.post<Cafe>(endpoints.owner.settings(cafeId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cafes", cafeId, "settings"], data);
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
    },
  });
}
