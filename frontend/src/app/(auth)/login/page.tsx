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
import { loginSchema, type LoginFormValues } from "@/lib/validation/auth";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import type { User } from "@/types/user";

interface LoginResponse {
  user: User;
  token: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data } = await apiClient.post<LoginResponse>(endpoints.auth.login, values);
      return data;
    },
    onSuccess: (data) => {
      signIn(data.token, data.user);
      router.push("/cafes");
    },
    onError: (error) => {
      toast({
        title: "Не удалось войти",
        description: extractApiErrorMessage(error, "Проверьте email и пароль."),
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle>Вход в MENZO QR</CardTitle>
        <CardDescription>Управляйте меню и заказами вашего кафе.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" hasError={Boolean(errors.email)} {...register("email")} />
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              hasError={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="mt-2" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Войти
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/55">
          Нет аккаунта?{" "}
          <Link href="/register" className="font-medium text-accent hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
