import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { User } from "@/types/user";
import type { StaffFormValues, StaffUpdateFormValues } from "@/lib/validation/staff";

export function useStaff(cafeId: number | string) {
  return useQuery({
    queryKey: ["cafes", cafeId, "staff"],
    queryFn: async () => {
      const { data } = await apiClient.get<User[]>(endpoints.owner.staff(cafeId));
      return data;
    },
    enabled: Boolean(cafeId),
  });
}

export function useCreateStaff(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: StaffFormValues) => {
      const { data } = await apiClient.post<User>(endpoints.owner.staff(cafeId), values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "staff"] });
    },
  });
}

export function useUpdateStaff(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, values }: { userId: number; values: StaffUpdateFormValues }) => {
      const { data } = await apiClient.patch<User>(endpoints.owner.staffMember(cafeId, userId), values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "staff"] });
    },
  });
}

export function useDeleteStaff(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      await apiClient.delete(endpoints.owner.staffMember(cafeId, userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "staff"] });
    },
  });
}
