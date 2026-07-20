"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dish } from "@/types/menu";

const TAG_STYLES: Record<string, string> = {
  new: "bg-accent/10 text-accent",
  hit: "bg-warning/10 text-warning",
  spicy: "bg-danger/10 text-danger",
  halal: "bg-success/10 text-success",
  vegetarian: "bg-success/10 text-success",
};

interface DishTileProps {
  dish: Dish;
  currency: string;
  index: number;
  onOpen: () => void;
}

export function DishTile({ dish, currency, index, onOpen }: DishTileProps) {
  const isOutOfStock = !dish.is_available;
  const [imageFailed, setImageFailed] = React.useState(false);
  const showImage = Boolean(dish.image_url) && !imageFailed;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      disabled={isOutOfStock}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-card-lg bg-white text-left shadow-soft transition-shadow",
        "hover:shadow-glass-lg active:shadow-soft",
        isOutOfStock && "opacity-60"
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-background">
        {showImage ? (
          <Image
            src={dish.image_url!}
            alt={dish.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
            loading="lazy"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <UtensilsCrossed className="h-8 w-8 text-muted" />
          </div>
        )}

        {dish.tags.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {dish.tags.map((tag) => (
              <span
                key={tag.value}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm",
                  TAG_STYLES[tag.value] ?? "bg-ink/10 text-ink"
                )}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold text-white">
              Нет в наличии
            </span>
          </div>
        )}

        {!isOutOfStock && (
          <span className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-accent shadow-soft">
            <Plus className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h3 className="line-clamp-1 font-medium text-ink">{dish.name}</h3>
        {dish.description && <p className="line-clamp-2 text-xs text-muted">{dish.description}</p>}
        <span className="mt-1 font-mono text-sm font-semibold text-ink">
          {dish.price} {currency}
        </span>
      </div>
    </motion.button>
  );
}
