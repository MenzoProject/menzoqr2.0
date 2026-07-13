import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Введите имя").max(255),
    email: z.string().min(1, "Введите email").email("Некорректный email"),
    phone: z.string().max(30).optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "Минимум 8 символов")
      .regex(/[a-z]/, "Нужна хотя бы одна строчная буква")
      .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
      .regex(/\d/, "Нужна хотя бы одна цифра"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Пароли не совпадают",
    path: ["password_confirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
