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
import { cn } from "@/lib/utils";
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
  const [activeStatus, setActiveStatus] = React.useState<OrderStatus>("new");

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
        <div>
          <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto pb-1">
            {BOARD_COLUMNS.map((column) => {
              const count = orders.filter((order) => order.status === column.status).length;
              const isActive = activeStatus === column.status;

              return (
                <button
                  key={column.status}
                  type="button"
                  onClick={() => setActiveStatus(column.status)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-accent text-white"
                      : "bg-ink/6 text-muted hover:bg-ink/10"
                  )}
                >
                  {column.label}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      isActive ? "bg-white/20 text-white" : "bg-white text-muted"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {(() => {
            const columnOrders = orders.filter((order) => order.status === activeStatus);

            if (columnOrders.length === 0) {
              return (
                <EmptyState
                  icon={ClipboardList}
                  title="Здесь пока пусто"
                  description="Заказы с этим статусом появятся тут автоматически."
                />
              );
            }

            return (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            );
          })()}
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
