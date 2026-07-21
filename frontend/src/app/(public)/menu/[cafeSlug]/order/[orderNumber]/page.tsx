"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, PackageSearch } from "lucide-react";
import { usePublicOrderStatus } from "@/hooks/use-public-order";
import { OrderStatusStepper } from "@/components/public/order-status-stepper";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export default function OrderStatusPage() {
  const params = useParams<{ cafeSlug: string; orderNumber: string }>();
  const { data: order, isLoading, isError } = usePublicOrderStatus(params.orderNumber);

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
      <Link href={`/menu/${params.cafeSlug}`} className="mb-6 flex items-center gap-1.5 text-sm text-muted">
        <ArrowLeft className="h-4 w-4" />
        Вернуться в меню
      </Link>

      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {isError && (
        <EmptyState
          icon={PackageSearch}
          title="Заказ не найден"
          description="Проверьте номер заказа или вернитесь в меню, чтобы оформить новый."
        />
      )}

      {!isLoading && order && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <div>
            <p className="text-sm text-muted">Заказ</p>
            <h1 className="font-mono text-2xl font-semibold text-cocoa">{order.order_number}</h1>
          </div>

          <Card>
            <OrderStatusStepper status={order.status} />
          </Card>

          <Card className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>{order.type_label}</span>
              {order.table && <span>Стол {order.table.number}</span>}
            </div>

            <div className="flex flex-col gap-2 border-t border-border pt-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-ink">
                    {item.dish_name}
                    {item.variant_name ? ` (${item.variant_name})` : ""} × {item.quantity}
                  </span>
                  <span className="font-mono text-muted">{item.unit_price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-medium text-ink">Итого</span>
              <span className="font-mono text-lg font-semibold text-ink">{order.total_amount}</span>
            </div>
          </Card>

          {order.status !== "delivered" && order.status !== "cancelled" && (
            <p className="flex items-center justify-center gap-2 text-center text-xs text-muted">
              <Loader2 className="h-3 w-3 animate-spin" />
              Статус обновляется автоматически
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
