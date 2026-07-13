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
import { Button } from "@/components/ui/button";
import { cafeSchema, type CafeFormValues } from "@/lib/validation/cafe";
import { useCreateCafe } from "@/hooks/use-cafes";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";

interface CafeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CafeFormDialog({ open, onOpenChange }: CafeFormDialogProps) {
  const { toast } = useToast();
  const createCafe = useCreateCafe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CafeFormValues>({ resolver: zodResolver(cafeSchema) });

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = (values: CafeFormValues) => {
    createCafe.mutate(values, {
      onSuccess: () => {
        toast({ title: "Кафе создано" });
        onOpenChange(false);
      },
      onError: (error) => {
        toast({
          title: "Не удалось создать кафе",
          description: extractApiErrorMessage(error, "Проверьте введенные данные."),
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новое кафе</DialogTitle>
          <DialogDescription>Заполните основные данные — остальное можно настроить позже.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cafe-name">Название</Label>
            <Input id="cafe-name" hasError={Boolean(errors.name)} {...register("name")} />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cafe-address">Адрес</Label>
            <Input id="cafe-address" {...register("address")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cafe-phone">Телефон</Label>
              <Input id="cafe-phone" {...register("phone")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cafe-currency">Валюта</Label>
              <Input id="cafe-currency" placeholder="RUB" {...register("currency")} />
              {errors.currency && <p className="text-xs text-danger">{errors.currency.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createCafe.isPending}>
              {createCafe.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Создать кафе
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
