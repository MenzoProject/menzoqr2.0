import { z } from "zod";

export const comboOfferSchema = z.object({
  title: z.string().min(1, "Введите название").max(255),
  description: z.string().max(500).optional().or(z.literal("")),
  price: z.coerce.number({ invalid_type_error: "Введите цену" }).min(0, "Цена не может быть отрицательной"),
  original_price: z.string().optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export type ComboOfferFormValues = z.infer<typeof comboOfferSchema>;
