"use client";

import { motion } from "framer-motion";
import { Check, Clock, ChefHat, PackageCheck, Handshake, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

const STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: "new", label: "Новый", icon: Clock },
  { status: "accepted", label: "Принят", icon: Check },
  { status: "preparing", label: "Готовится", icon: ChefHat },
  { status: "ready", label: "Готов", icon: PackageCheck },
  { status: "delivered", label: "Выдан", icon: Handshake },
];

export function OrderStatusStepper({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card-lg bg-danger/8 py-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
          <XCircle className="h-6 w-6" />
        </span>
        <p className="font-medium text-ink">Заказ отменен</p>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.status === status);

  return (
    <div className="flex items-center justify-between">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex flex-1 flex-col items-center gap-2 last:flex-none">
            <div className="flex w-full items-center">
              {index > 0 && (
                <div className={cn("h-0.5 flex-1", index <= currentIndex ? "bg-accent" : "bg-border")} />
              )}
              <motion.div
                animate={isCurrent ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={{ duration: 1.6, repeat: isCurrent ? Infinity : 0, ease: "easeInOut" }}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isDone && "border-accent bg-accent text-white",
                  isCurrent && "border-accent bg-white text-accent",
                  !isDone && !isCurrent && "border-border bg-white text-muted"
                )}
              >
                <Icon className="h-4 w-4" />
              </motion.div>
              {index < STEPS.length - 1 && (
                <div className={cn("h-0.5 flex-1", index < currentIndex ? "bg-accent" : "bg-border")} />
              )}
            </div>
            <span className={cn("text-[11px] font-medium", isCurrent ? "text-ink" : "text-muted")}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
