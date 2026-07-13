"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCafe } from "@/hooks/use-cafes";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { OrderCard } from "@/components/orders/order-card";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";
import type { Order, OrderStatus } from "@/types/order";

const BOARD_COLUMNS: { status: OrderStatus; label: string }[] = [
  { status: "new", label: "Новые" },
  { status: "accepted", label: "Принятые" },
  { status: "preparing", label: "Готовятся" },
  { status: "ready", label: "Готовы" },
  { status: "delivered", label: "Выданы" },
];

export default function OrdersPage() {
  const params = useParams<{ cafeId: string }>();
  const { data: cafe } = useCafe(params.cafeId);
  const { data, isLoading } = useOrders(params.cafeId);
  const updateStatus = useUpdateOrderStatus(params.cafeId);
  const { toast } = useToast();
  const [cancelTarget, setCancelTarget] = React.useState<Order | null>(null);
  const [pendingOrderId, setPendingOrderId] = React.useState<number | null>(null);

  const currency = cafe?.currency ?? "RUB";
  const orders = data?.data ?? [];

  const handleAdvance = (order: Order, status: OrderStatus) => {
    setPendingOrderId(order.id);
    updateStatus.mutate(
      { orderId: order.id, status },
      {
        onSettled: () => setPendingOrderId(null),
        onError: (error) => {
          toast({
            title: "Не удалось изменить статус",
            description: extractApiErrorMessage(error, "Попробуйте еще раз."),
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div>
      <PageHeader title="Заказы" description="Заказы обновляются автоматически каждые 15 секунд." />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((key) => (
            <div key={key} className="flex flex-col gap-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="Заказов пока нет"
          description="Новые заказы от гостей появятся здесь автоматически, а владелец получит уведомление в Telegram."
        />
      )}

      {!isLoading && orders.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {BOARD_COLUMNS.map((column) => {
            const columnOrders = orders.filter((order) => order.status === column.status);

            return (
              <div key={column.status} className="flex w-[280px] shrink-0 flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold text-ink">{column.label}</h3>
                  <span className="rounded-full bg-ink/6 px-2 py-0.5 text-xs text-muted">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {columnOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      currency={currency}
                      isUpdating={pendingOrderId === order.id}
                      onAdvance={(status) => handleAdvance(order, status)}
                      onCancel={() => setCancelTarget(order)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title={`Отменить заказ №${cancelTarget?.order_number}?`}
        description="Гость и статус заказа будут обновлены. Это действие нельзя отменить."
        confirmLabel="Отменить заказ"
        isLoading={updateStatus.isPending}
        onConfirm={() => {
          if (!cancelTarget) return;
          handleAdvance(cancelTarget, "cancelled");
          setCancelTarget(null);
        }}
      />
    </div>
  );
}
