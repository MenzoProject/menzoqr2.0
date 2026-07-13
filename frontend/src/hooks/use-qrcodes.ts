import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { QrCode } from "@/types/qrcode";
import type { QrCodeFormValues } from "@/lib/validation/qrcode";

export function useQrCodes(cafeId: number | string) {
  return useQuery({
    queryKey: ["cafes", cafeId, "qr-codes"],
    queryFn: async () => {
      const { data } = await apiClient.get<QrCode[]>(endpoints.owner.qrCodes(cafeId));
      return data;
    },
    enabled: Boolean(cafeId),
  });
}

export function useCreateQrCode(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: QrCodeFormValues) => {
      const { data } = await apiClient.post<QrCode>(endpoints.owner.qrCodes(cafeId), values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "qr-codes"] });
    },
  });
}

export function useDeleteQrCode(cafeId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (qrCodeId: number) => {
      await apiClient.delete(endpoints.owner.qrCode(cafeId, qrCodeId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes", cafeId, "qr-codes"] });
    },
  });
}
