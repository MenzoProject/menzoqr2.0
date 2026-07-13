"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiClient, extractApiErrorMessage } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { registerSchema, type RegisterFormValues } from "@/lib/validation/auth";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import type { User } from "@/types/user";

interface RegisterResponse {
  user: User;
  token: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const { data } = await apiClient.post<RegisterResponse>(endpoints.auth.register, values);
      return data;
    },
    onSuccess: (data) => {
      signIn(data.token, data.user);
      router.push("/cafes");
    },
    onError: (error) => {
      toast({
        title: "Не удалось создать аккаунт",
        description: extractApiErrorMessage(error, "Проверьте введенные данные."),
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle>Создать аккаунт</CardTitle>
        <CardDescription>Начните управлять меню кафе за пару минут.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Имя</Label>
            <Input id="name" autoComplete="name" hasError={Boolean(errors.name)} {...register("name")} />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" hasError={Boolean(errors.email)} {...register("email")} />
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Телефон (необязательно)</Label>
            <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              hasError={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password_confirmation">Повторите пароль</Label>
            <Input
              id="password_confirmation"
              type="password"
              autoComplete="new-password"
              hasError={Boolean(errors.password_confirmation)}
              {...register("password_confirmation")}
            />
            {errors.password_confirmation && (
              <p className="text-xs text-danger">{errors.password_confirmation.message}</p>
            )}
          </div>

          <Button type="submit" className="mt-2" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Зарегистрироваться
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/55">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Войти
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
