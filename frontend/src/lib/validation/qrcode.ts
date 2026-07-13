import { z } from "zod";

export const qrCodeSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("takeaway") }),
  z.object({
    type: z.literal("table"),
    table_number: z.string().min(1, "Укажите номер стола").max(50),
  }),
]);

export type QrCodeFormValues = z.infer<typeof qrCodeSchema>;
