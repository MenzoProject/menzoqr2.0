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
import { comboOfferSchema, type ComboOfferFormValues } from "@/lib/validation/combo-offer";
import { useCreateComboOffer, useUpdateComboOffer } from "@/hooks/use-combo-offers";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";
import type { ComboOffer } from "@/types/combo-offer";

interface ComboOfferFormDialogProps {
  cafeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comboOffer?: ComboOffer | null;
}

export function ComboOfferFormDialog({ cafeId, open, onOpenChange, comboOffer }: ComboOfferFormDialogProps) {
  const { toast } = useToast();
  const createCombo = useCreateComboOffer(cafeId);
  const updateCombo = useUpdateComboOffer(cafeId);
  const isEditing = Boolean(comboOffer);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ComboOfferFormValues>({
    resolver: zodResolver(comboOfferSchema),
    defaultValues: { title: "", description: "", price: 0, original_price: "", is_active: true },
  });

  React.useEffect(() => {
    if (open) {
      setImageFile(null);
      reset({
        title: comboOffer?.title ?? "",
        description: comboOffer?.description ?? "",
        price: comboOffer?.price ?? 0,
        original_price: comboOffer?.original_price != null ? String(comboOffer.original_price) : "",
        is_active: comboOffer?.is_active ?? true,
      });
    }
  }, [open, comboOffer, reset]);

  const isPending = createCombo.isPending || updateCombo.isPending;

  const onSubmit = (values: ComboOfferFormValues) => {
    const originalPrice = values.original_price ? Number(values.original_price) : undefined;

    const payload = {
      title: values.title,
      description: values.description || undefined,
      price: values.price,
      original_price: originalPrice,
      is_active: values.is_active,
      image: imageFile,
    };

    const onSettled = {
      onSuccess: () => {
        toast({ title: isEditing ? "Комбо обновлено" : "Комбо добавлено" });
        onOpenChange(false);
      },
      onError: (error: unknown) => {
        toast({
          title: "Не удалось сохранить комбо",
          description: extractApiErrorMessage(error, "Проверьте введённые данные."),
          variant: "destructive" as const,
        });
      },
    };

    if (isEditing && comboOffer) {
      updateCombo.mutate({ comboOfferId: comboOffer.id, values: payload }, onSettled);
    } else {
      createCombo.mutate(payload, onSettled);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Редактировать комбо" : "Новое комбо"}</DialogTitle>
          <DialogDescription>Промо-предложение «Комбо дня» на главной странице меню.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="combo-image">Изображение</Label>
            <label
              htmlFor="combo-image"
              className="flex h-11 cursor-pointer items-center gap-2 rounded-card border border-dashed border-border px-4 text-sm text-muted hover:bg-ink/5"
            >
              <ImagePlus className="h-4 w-4" />
              {imageFile
                ? imageFile.name
                : comboOffer?.image_url
                  ? "Заменить изображение"
                  : "Загрузить изображение (необязательно)"}
            </label>
            <input
              id="combo-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="combo-title">Название</Label>
            <Input id="combo-title" placeholder="Плов + Салат + Напиток" {...register("title")} />
            {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="combo-description">Описание</Label>
            <Textarea id="combo-description" rows={2} placeholder="По специальной цене" {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="combo-price">Цена комбо</Label>
              <Input
                id="combo-price"
                type="number"
                step="0.01"
                hasError={Boolean(errors.price)}
                {...register("price")}
              />
              {errors.price && <p className="text-xs text-danger">{errors.price.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="combo-original-price">Цена до скидки</Label>
              <Input id="combo-original-price" type="number" step="0.01" placeholder="Необязательно" {...register("original_price")} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-card border border-border px-4 py-3">
            <Label htmlFor="combo-active">Показывать на главной</Label>
            <Switch
              id="combo-active"
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
