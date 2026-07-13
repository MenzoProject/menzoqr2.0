"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildCheckoutSchema, type CheckoutFormValues } from "@/lib/validation/checkout";
import { useCreatePublicOrder } from "@/hooks/use-public-order";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";
import type { OrderType } from "@/types/order";

interface CheckoutSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cafeSlug: string;
  currency: string;
  orderType: OrderType;
  tableId: number | null;
  tableNumber: string | null;
}

export function CheckoutSheet({
  open,
  onOpenChange,
  cafeSlug,
  currency,
  orderType,
  tableId,
  tableNumber,
}: CheckoutSheetProps) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { toast } = useToast();
  const createOrder = useCreatePublicOrder(cafeSlug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(buildCheckoutSchema(orderType)),
    defaultValues: { customer_name: "", customer_phone: "", comment: "" },
  });

  React.useEffect(() => {
    if (!open) reset({ customer_name: "", customer_phone: "", comment: "" });
  }, [open, reset]);

  const onSubmit = (values: CheckoutFormValues) => {
    createOrder.mutate(
      {
        type: orderType,
        table_id: tableId ?? undefined,
        customer_name: values.customer_name,
        customer_phone: orderType === "takeaway" ? values.customer_phone : undefined,
        comment: values.comment || undefined,
        items,
      },
      {
        onSuccess: (order) => {
          clear();
          onOpenChange(false);
          router.push(`/menu/${cafeSlug}/order/${order.order_number}`);
        },
        onError: (error) => {
          toast({
            title: "Не удалось оформить заказ",
            description: extractApiErrorMessage(error, "Проверьте данные и попробуйте снова."),
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Оформление заказа" className="pb-4">
      <div className="flex flex-col gap-5 pt-1">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Оформление заказа</h2>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge variant={orderType === "table" ? "accent" : "default"}>
              {orderType === "table" ? `Стол ${tableNumber ?? ""}` : "Самовывоз"}
            </Badge>
            <span className="font-mono text-sm text-muted">
              {subtotal.toFixed(0)} {currency}
            </span>
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="checkout-name">Ваше имя</Label>
            <Input
              id="checkout-name"
              autoComplete="name"
              hasError={Boolean(errors.customer_name)}
              {...register("customer_name")}
            />
            {errors.customer_name && <p className="text-xs text-danger">{errors.customer_name.message}</p>}
          </div>

          {orderType === "takeaway" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkout-phone">Телефон</Label>
              <Input
                id="checkout-phone"
                type="tel"
                autoComplete="tel"
                hasError={Boolean(errors.customer_phone)}
                {...register("customer_phone")}
              />
              {errors.customer_phone && <p className="text-xs text-danger">{errors.customer_phone.message}</p>}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="checkout-comment">Комментарий (необязательно)</Label>
            <Textarea id="checkout-comment" rows={2} {...register("comment")} />
          </div>

          <Button type="submit" size="lg" disabled={createOrder.isPending} className="mt-1 w-full">
            {createOrder.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Оформить · {subtotal.toFixed(0)} {currency}
          </Button>
        </form>
      </div>
    </BottomSheet>
  );
}
