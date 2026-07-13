"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 50, className }: QuantityStepperProps) {
  return (
    <div className={cn("flex items-center gap-1 rounded-full bg-background p-1", className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition disabled:opacity-30 hover:bg-white active:scale-95"
        aria-label="Уменьшить количество"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center font-mono text-sm font-semibold text-ink">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition disabled:opacity-30 hover:bg-white active:scale-95"
        aria-label="Увеличить количество"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
