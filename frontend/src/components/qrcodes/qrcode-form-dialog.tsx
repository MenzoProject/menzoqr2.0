"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import { useCreateQrCode } from "@/hooks/use-qrcodes";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";
import type { QrCodeType } from "@/types/qrcode";

interface QrCodeFormDialogProps {
  cafeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  type: QrCodeType;
  table_number: string;
}

export function QrCodeFormDialog({ cafeId, open, onOpenChange }: QrCodeFormDialogProps) {
  const { toast } = useToast();
  const createQrCode = useCreateQrCode(cafeId);

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormState>({
    defaultValues: { type: "table", table_number: "" },
  });

  React.useEffect(() => {
    if (!open) reset({ type: "table", table_number: "" });
  }, [open, reset]);

  const type = watch("type");

  const onSubmit = (values: FormState) => {
    const payload =
      values.type === "table"
        ? { type: "table" as const, table_number: values.table_number }
        : { type: "takeaway" as const };

    createQrCode.mutate(payload, {
      onSuccess: () => {
        toast({ title: "QR-код создан" });
        onOpenChange(false);
      },
      onError: (error) => {
        toast({
          title: "Не удалось создать QR-код",
          description: extractApiErrorMessage(error, "Проверьте данные."),
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый QR-код</DialogTitle>
          <DialogDescription>Код для стола или самовывоза, ведущий на публичное меню.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <Label>Тип</Label>
            <Select value={type} onValueChange={(value) => setValue("type", value as QrCodeType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Для стола (в заведении)</SelectItem>
                <SelectItem value="takeaway">Для самовывоза</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "table" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="table-number">Номер стола</Label>
              <Input id="table-number" {...register("table_number")} />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createQrCode.isPending}>
              {createQrCode.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Создать
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
