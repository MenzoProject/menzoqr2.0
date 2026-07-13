import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Введите название").max(255),
  is_active: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const dishSchema = z.object({
  name: z.string().min(1, "Введите название").max(255),
  description: z.string().max(2000).optional().or(z.literal("")),
  price: z.coerce.number({ invalid_type_error: "Введите цену" }).min(0, "Цена не может быть отрицательной"),
  is_active: z.boolean().default(true),
  is_available: z.boolean().default(true),
  tags: z.array(z.enum(["new", "hit", "spicy", "halal", "vegetarian"])).default([]),
});

export type DishFormValues = z.infer<typeof dishSchema>;

export const dishVariantSchema = z.object({
  name: z.string().min(1, "Введите название").max(255),
  price_modifier: z.coerce.number({ invalid_type_error: "Введите число" }),
});

export type DishVariantFormValues = z.infer<typeof dishVariantSchema>;

export const dishAddonSchema = z.object({
  name: z.string().min(1, "Введите название").max(255),
  price: z.coerce.number({ invalid_type_error: "Введите цену" }).min(0),
});

export type DishAddonFormValues = z.infer<typeof dishAddonSchema>;

export const dishFullSchema = dishSchema.extend({
  variants: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1, "Введите название"),
        price_modifier: z.coerce.number({ invalid_type_error: "Введите число" }),
      })
    )
    .default([]),
  addons: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1, "Введите название"),
        price: z.coerce.number({ invalid_type_error: "Введите цену" }).min(0),
      })
    )
    .default([]),
});

export type DishFullFormValues = z.infer<typeof dishFullSchema>;
