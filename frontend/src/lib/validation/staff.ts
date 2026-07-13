import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(2, "Введите имя").max(255),
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  phone: z.string().max(30).optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Минимум 8 символов")
    .regex(/[a-z]/, "Нужна хотя бы одна строчная буква")
    .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
    .regex(/\d/, "Нужна хотя бы одна цифра"),
  role: z.enum(["manager", "staff"]),
});

export type StaffFormValues = z.infer<typeof staffSchema>;

export const staffUpdateSchema = z.object({
  name: z.string().min(2, "Введите имя").max(255).optional(),
  phone: z.string().max(30).optional().or(z.literal("")),
  role: z.enum(["manager", "staff"]).optional(),
  is_active: z.boolean().optional(),
});

export type StaffUpdateFormValues = z.infer<typeof staffUpdateSchema>;
