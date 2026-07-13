"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { categorySchema, type CategoryFormValues } from "@/lib/validation/menu";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";
import type { Category } from "@/types/menu";

interface CategoryFormDialogProps {
  cafeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

export function CategoryFormDialog({ cafeId, open, onOpenChange, category }: CategoryFormDialogProps) {
  const { toast } = useToast();
  const createCategory = useCreateCategory(cafeId);
  const updateCategory = useUpdateCategory(cafeId);
  const isEditing = Boolean(category);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", is_active: true },
  });

  React.useEffect(() => {
    if (open) {
      reset({ name: category?.name ?? "", is_active: category?.is_active ?? true });
    }
  }, [open, category, reset]);

  const isPending = createCategory.isPending || updateCategory.isPending;

  const onSubmit = (values: CategoryFormValues) => {
    const onSettled = {
      onSuccess: () => {
        toast({ title: isEditing ? "Категория обновлена" : "Категория создана" });
        onOpenChange(false);
      },
      onError: (error: unknown) => {
        toast({
          title: "Не удалось сохранить категорию",
          description: extractApiErrorMessage(error, "Проверьте введенные данные."),
          variant: "destructive" as const,
        });
      },
    };

    if (isEditing && category) {
      updateCategory.mutate({ categoryId: category.id, values }, onSettled);
    } else {
      createCategory.mutate(values, onSettled);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Редактировать категорию" : "Новая категория"}</DialogTitle>
          <DialogDescription>Название и видимость категории в публичном меню.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-name">Название</Label>
            <Input id="category-name" hasError={Boolean(errors.name)} {...register("name")} />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div className="flex items-center justify-between rounded-card border border-border px-4 py-3">
            <Label htmlFor="category-active">Показывать в меню</Label>
            <Switch
              id="category-active"
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
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
