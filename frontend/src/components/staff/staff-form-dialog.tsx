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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { staffSchema, type StaffFormValues } from "@/lib/validation/staff";
import { useCreateStaff } from "@/hooks/use-staff";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";

interface StaffFormDialogProps {
  cafeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffFormDialog({ cafeId, open, onOpenChange }: StaffFormDialogProps) {
  const { toast } = useToast();
  const createStaff = useCreateStaff(cafeId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: { role: "staff" },
  });

  React.useEffect(() => {
    if (!open) reset({ role: "staff", name: "", email: "", phone: "", password: "" });
  }, [open, reset]);

  const onSubmit = (values: StaffFormValues) => {
    createStaff.mutate(values, {
      onSuccess: () => {
        toast({ title: "Сотрудник добавлен" });
        onOpenChange(false);
      },
      onError: (error) => {
        toast({
          title: "Не удалось добавить сотрудника",
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
          <DialogTitle>Новый сотрудник</DialogTitle>
          <DialogDescription>Доступ менеджера или персонала к этому кафе.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-name">Имя</Label>
            <Input id="staff-name" hasError={Boolean(errors.name)} {...register("name")} />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-email">Email</Label>
            <Input id="staff-email" type="email" hasError={Boolean(errors.email)} {...register("email")} />
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-phone">Телефон</Label>
            <Input id="staff-phone" {...register("phone")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-password">Временный пароль</Label>
            <Input id="staff-password" type="password" hasError={Boolean(errors.password)} {...register("password")} />
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Роль</Label>
            <Select value={watch("role")} onValueChange={(value) => setValue("role", value as "manager" | "staff")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Менеджер — управляет меню и заказами</SelectItem>
                <SelectItem value="staff">Персонал — только заказы</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createStaff.isPending}>
              {createStaff.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Добавить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
