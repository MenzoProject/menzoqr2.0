"use client";

import * as React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ImagePlus, Store } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { settingsSchema, type SettingsFormValues } from "@/lib/validation/settings";
import { useCafeSettings, useUpdateCafeSettings } from "@/hooks/use-settings";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";

export default function SettingsPage() {
  const params = useParams<{ cafeId: string }>();
  const { data: cafe, isLoading } = useCafeSettings(params.cafeId);
  const updateSettings = useUpdateCafeSettings(params.cafeId);
  const { toast } = useToast();
  const [logoFile, setLogoFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({ resolver: zodResolver(settingsSchema) });

  React.useEffect(() => {
    if (cafe) {
      reset({
        name: cafe.name,
        address: cafe.address ?? "",
        phone: cafe.phone ?? "",
        currency: cafe.currency,
      });
    }
  }, [cafe, reset]);

  const onSubmit = (values: SettingsFormValues) => {
    updateSettings.mutate(
      { ...values, logo: logoFile },
      {
        onSuccess: () => {
          toast({ title: "Настройки сохранены" });
          setLogoFile(null);
        },
        onError: (error) => {
          toast({
            title: "Не удалось сохранить настройки",
            description: extractApiErrorMessage(error, "Проверьте введенные данные."),
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div>
      <PageHeader title="Настройки кафе" description="Основная информация, которую видят гости и сотрудники." />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Общая информация</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-card bg-background">
                  {logoFile ? (
                    <Image
                      src={URL.createObjectURL(logoFile)}
                      alt="Логотип"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : cafe?.logo_url ? (
                    <Image src={cafe.logo_url} alt="Логотип" width={64} height={64} className="h-full w-full object-cover" />
                  ) : (
                    <Store className="h-6 w-6 text-muted" />
                  )}
                </div>
                <label
                  htmlFor="cafe-logo"
                  className="flex cursor-pointer items-center gap-2 rounded-card border border-dashed border-border px-4 py-2 text-sm text-muted hover:bg-ink/5"
                >
                  <ImagePlus className="h-4 w-4" />
                  Изменить логотип
                </label>
                <input
                  id="cafe-logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="settings-name">Название</Label>
                <Input id="settings-name" hasError={Boolean(errors.name)} {...register("name")} />
                {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="settings-address">Адрес</Label>
                <Input id="settings-address" {...register("address")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="settings-phone">Телефон</Label>
                  <Input id="settings-phone" {...register("phone")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="settings-currency">Валюта</Label>
                  <Input id="settings-currency" {...register("currency")} />
                  {errors.currency && <p className="text-xs text-danger">{errors.currency.message}</p>}
                </div>
              </div>

              <Button type="submit" className="self-start" disabled={updateSettings.isPending}>
                {updateSettings.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Сохранить изменения
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
