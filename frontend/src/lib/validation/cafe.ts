import { z } from "zod";

export const cafeSchema = z.object({
  name: z.string().min(2, "Введите название").max(255),
  address: z.string().max(255).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  currency: z.string().length(3, "3 буквы, например RUB").optional().or(z.literal("")),
});

export type CafeFormValues = z.infer<typeof cafeSchema>;
