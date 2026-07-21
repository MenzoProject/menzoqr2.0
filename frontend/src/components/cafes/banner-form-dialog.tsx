"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ImagePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { bannerSchema, type BannerFormValues } from "@/lib/validation/banner";
import { useCreateBanner, useUpdateBanner } from "@/hooks/use-banners";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";
import type { Banner } from "@/types/banner";

interface BannerFormDialogProps {
  cafeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
}

export function BannerFormDialog({ cafeId, open, onOpenChange, banner }: BannerFormDialogProps) {
  const { toast } = useToast();
  const createBanner = useCreateBanner(cafeId);
  const updateBanner = useUpdateBanner(cafeId);
  const isEditing = Boolean(banner);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: { title: "", subtitle: "", is_active: true },
  });

  React.useEffect(() => {
    if (open) {
      setImageFile(null);
      reset({
        title: banner?.title ?? "",
        subtitle: banner?.subtitle ?? "",
        is_active: banner?.is_active ?? true,
      });
    }
  }, [open, banner, reset]);

  const isPending = createBanner.isPending || updateBanner.isPending;

  const onSubmit = (values: BannerFormValues) => {
    if (!isEditing && !imageFile) {
      toast({ title: "Загрузите изображение баннера", variant: "destructive" });
      return;
    }

    const payload = { ...values, image: imageFile };

    const onSettled = {
      onSuccess: () => {
        toast({ title: isEditing ? "Баннер обновлён" : "Баннер добавлен" });
        onOpenChange(false);
      },
      onError: (error: unknown) => {
        toast({
          title: "Не удалось сохранить баннер",
          description: extractApiErrorMessage(error, "Проверьте введённые данные."),
          variant: "destructive" as const,
        });
      },
    };

    if (isEditing && banner) {
      updateBanner.mutate({ bannerId: banner.id, values: payload }, onSettled);
    } else {
      createBanner.mutate(payload, onSettled);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Редактировать баннер" : "Новый баннер"}</DialogTitle>
          <DialogDescription>
            Слайд в шапке главной страницы меню. Рекомендуемое соотношение — альбомное, широкое фото.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="banner-image">Изображение</Label>
            <label
              htmlFor="banner-image"
              className="flex h-11 cursor-pointer items-center gap-2 rounded-card border border-dashed border-border px-4 text-sm text-muted hover:bg-ink/5"
            >
              <ImagePlus className="h-4 w-4" />
              {imageFile ? imageFile.name : banner?.image_url ? "Заменить изображение" : "Загрузить изображение"}
            </label>
            <input
              id="banner-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="banner-title">Заголовок</Label>
            <Input id="banner-title" placeholder="Настоящая восточная кухня" {...register("title")} />
            {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="banner-subtitle">Подзаголовок</Label>
            <Textarea
              id="banner-subtitle"
              rows={2}
              placeholder="Готовим традиционные блюда каждый день из свежих продуктов."
              {...register("subtitle")}
            />
          </div>

          <div className="flex items-center justify-between rounded-card border border-border px-4 py-3">
            <Label htmlFor="banner-active">Показывать на главной</Label>
            <Switch
              id="banner-active"
              checked={watch("is_active")}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Сохранить" : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
