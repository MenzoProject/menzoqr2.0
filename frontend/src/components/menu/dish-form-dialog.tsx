"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, ImagePlus } from "lucide-react";
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
import { dishFullSchema, type DishFullFormValues } from "@/lib/validation/menu";
import { useCreateDish, useUpdateDish } from "@/hooks/use-dishes";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";
import { DISH_TAG_OPTIONS } from "@/types/menu";
import { cn } from "@/lib/utils";
import type { Dish } from "@/types/menu";

interface DishFormDialogProps {
  cafeId: string;
  categoryId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish?: Dish | null;
}

export function DishFormDialog({ cafeId, categoryId, open, onOpenChange, dish }: DishFormDialogProps) {
  const { toast } = useToast();
  const createDish = useCreateDish(cafeId, categoryId);
  const updateDish = useUpdateDish(cafeId, categoryId);
  const isEditing = Boolean(dish);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<DishFullFormValues>({
    resolver: zodResolver(dishFullSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      is_active: true,
      is_available: true,
      tags: [],
      variants: [],
      addons: [],
    },
  });

  const variantsArray = useFieldArray({ control, name: "variants" });
  const addonsArray = useFieldArray({ control, name: "addons" });

  React.useEffect(() => {
    if (open) {
      setImageFile(null);
      reset({
        name: dish?.name ?? "",
        description: dish?.description ?? "",
        price: dish?.price ?? 0,
        is_active: dish?.is_active ?? true,
        is_available: dish?.is_available ?? true,
        tags: dish?.tags.map((t) => t.value) ?? [],
        variants: dish?.variants.map((v) => ({ id: v.id, name: v.name, price_modifier: v.price_modifier })) ?? [],
        addons: dish?.addons.map((a) => ({ id: a.id, name: a.name, price: a.price })) ?? [],
      });
    }
  }, [open, dish, reset]);

  const isPending = createDish.isPending || updateDish.isPending;

  const onSubmit = (values: DishFullFormValues) => {
    const payload = { ...values, image: imageFile };

    const onSettled = {
      onSuccess: () => {
        toast({ title: isEditing ? "Блюдо обновлено" : "Блюдо добавлено" });
        onOpenChange(false);
      },
      onError: (error: unknown) => {
        toast({
          title: "Не удалось сохранить блюдо",
          description: extractApiErrorMessage(error, "Проверьте введенные данные."),
          variant: "destructive" as const,
        });
      },
    };

    if (isEditing && dish) {
      updateDish.mutate({ dishId: dish.id, values: payload }, onSettled);
    } else {
      createDish.mutate(payload, onSettled);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Редактировать блюдо" : "Новое блюдо"}</DialogTitle>
          <DialogDescription>Фото, цена, варианты и дополнения блюда.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dish-name">Название</Label>
            <Input id="dish-name" hasError={Boolean(errors.name)} {...register("name")} />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dish-description">Описание</Label>
            <Textarea id="dish-description" rows={3} {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dish-price">Цена</Label>
              <Input id="dish-price" type="number" step="0.01" hasError={Boolean(errors.price)} {...register("price")} />
              {errors.price && <p className="text-xs text-danger">{errors.price.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dish-image">Фото</Label>
              <label
                htmlFor="dish-image"
                className="flex h-11 cursor-pointer items-center gap-2 rounded-card border border-dashed border-border px-4 text-sm text-muted hover:bg-ink/5"
              >
                <ImagePlus className="h-4 w-4" />
                {imageFile ? imageFile.name : dish?.image_url ? "Заменить фото" : "Загрузить фото"}
              </label>
              <input
                id="dish-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-card border border-border px-4 py-3">
            <Label htmlFor="dish-active">Показывать в меню</Label>
            <Switch
              id="dish-active"
              checked={watch("is_active")}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
          </div>

          <div className="flex items-center justify-between rounded-card border border-border px-4 py-3">
            <div className="flex flex-col">
              <Label htmlFor="dish-available">В наличии</Label>
              <span className="text-xs text-muted">Если выключено, блюдо остаётся в меню с пометкой «Нет в наличии»</span>
            </div>
            <Switch
              id="dish-available"
              checked={watch("is_available")}
              onCheckedChange={(checked) => setValue("is_available", checked)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Бейджи</Label>
            <div className="flex flex-wrap gap-2">
              {DISH_TAG_OPTIONS.map((option) => {
                const currentTags = watch("tags");
                const isSelected = currentTags.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setValue(
                        "tags",
                        isSelected
                          ? currentTags.filter((tag) => tag !== option.value)
                          : [...currentTags, option.value]
                      )
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted hover:bg-ink/5"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variants */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Варианты (размер, объём)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => variantsArray.append({ name: "", price_modifier: 0 })}
              >
                <Plus className="h-3.5 w-3.5" />
                Добавить
              </Button>
            </div>
            {variantsArray.fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input placeholder="Название" {...register(`variants.${index}.name`)} />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="+/- к цене"
                  className="w-[140px]"
                  {...register(`variants.${index}.price_modifier`)}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => variantsArray.remove(index)}>
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            ))}
          </div>

          {/* Addons */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Дополнения</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addonsArray.append({ name: "", price: 0 })}
              >
                <Plus className="h-3.5 w-3.5" />
                Добавить
              </Button>
            </div>
            {addonsArray.fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input placeholder="Название" {...register(`addons.${index}.name`)} />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Цена"
                  className="w-[140px]"
                  {...register(`addons.${index}.price`)}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => addonsArray.remove(index)}>
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
