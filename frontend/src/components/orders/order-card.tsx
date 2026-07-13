"use client";

import { useState } from "react";
import { Loader2, Phone, ArrowRight, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORDER_TRANSITIONS } from "@/types/order";
import type { Order, OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Принять",
  accepted: "Начать готовить",
  preparing: "Готово",
  ready: "Выдать",
  delivered: "Выдан",
  cancelled: "Отменен",
};

function nextStatus(status: OrderStatus): OrderStatus | null {
  const transitions = ORDER_TRANSITIONS[status].filter((s) => s !== "cancelled");
  return transitions[0] ?? null;
}

function timeAgo(dateString: string): string {
  const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(dateString).getTime()) / 60000));
  if (diffMinutes < 1) return "только что";
  if (diffMinutes < 60) return `${diffMinutes} мин назад`;
  return `${Math.round(diffMinutes / 60)} ч назад`;
}

interface OrderCardProps {
  order: Order;
  currency: string;
  onAdvance: (status: OrderStatus) => void;
  onCancel: () => void;
  isUpdating?: boolean;
}

export function OrderCard({ order, currency, onAdvance, onCancel, isUpdating }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const advanceTo = nextStatus(order.status);

  return (
    <Card
      className={cn(
        "flex flex-col gap-3 p-4",
        order.status === "new" && "border border-accent/30"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {order.status === "new" && <span className="status-pulse" />}
          <span className="font-mono text-sm font-semibold text-ink">{order.order_number}</span>
        </div>
        <Badge variant={order.type === "table" ? "accent" : "default"}>
          {order.type === "table" ? `Стол ${order.table?.number ?? ""}` : "Самовывоз"}
        </Badge>
      </div>

      <button type="button" onClick={() => setExpanded((v) => !v)} className="text-left">
        <p className="text-sm font-medium text-ink">{order.customer_name}</p>
        <p className="flex items-center gap-1 text-xs text-muted">
          <Phone className="h-3 w-3" />
          {order.customer_phone}
        </p>
      </button>

      {expanded && (
        <ul className="flex flex-col gap-1 rounded-card bg-background px-3 py-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-2 text-ink/80">
              <span>
                {item.dish_name}
                {item.variant_name ? ` (${item.variant_name})` : ""} × {item.quantity}
              </span>
              <span className="font-mono text-xs text-muted">{item.unit_price}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-ink">{order.total_amount} {currency}</span>
        <span className="text-xs text-muted">{timeAgo(order.created_at)}</span>
      </div>

      <div className="flex items-center gap-2">
        {advanceTo && (
          <Button size="sm" className="flex-1" disabled={isUpdating} onClick={() => onAdvance(advanceTo)}>
            {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
            {STATUS_LABELS[order.status]}
          </Button>
        )}
        {order.status !== "delivered" && order.status !== "cancelled" && (
          <Button size="sm" variant="ghost" disabled={isUpdating} onClick={onCancel}>
            <XCircle className="h-3.5 w-3.5 text-danger" />
          </Button>
        )}
      </div>
    </Card>
  );
}
