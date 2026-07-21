"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Heart, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dish } from "@/types/menu";

const TAG_STYLES: Record<string, string> = {
  new: "border-success/30 bg-success/10 text-success",
  hit: "border-danger/30 bg-danger/10 text-danger",
  spicy: "border-danger/30 bg-danger/10 text-danger",
  halal: "border-success/30 bg-success/10 text-success",
  vegetarian: "border-success/30 bg-success/10 text-success",
};

interface DishListItemProps {
  dish: Dish;
  currency: string;
  index: number;
  onOpen: () => void;
}

export function DishListItem({ dish, currency, index, onOpen }: DishListItemProps) {
  const isOutOfStock = !dish.is_available;
  const [imageFailed, setImageFailed] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const showImage = Boolean(dish.image_url) && !imageFailed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex gap-3 overflow-hidden rounded-card-lg bg-white p-2.5 shadow-soft",
        isOutOfStock && "opacity-60"
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        disabled={isOutOfStock}
        className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-card bg-cream-dark"
      >
        {showImage ? (
          <Image
            src={dish.image_url!}
            alt={dish.name}
            fill
            sizes="104px"
            loading="lazy"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <UtensilsCrossed className="h-6 w-6 text-gold-dark/60" />
          </div>
        )}

        {dish.tags[0] && (
          <span
            className={cn(
              "absolute left-1.5 top-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm",
              TAG_STYLES[dish.tags[0].value] ?? "border-ink/10 bg-ink/10 text-ink"
            )}
          >
            {dish.tags[0].label}
          </span>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-cocoa/85 px-2 py-0.5 text-[10px] font-semibold text-white">
              Нет в наличии
            </span>
          </div>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            {dish.tags.slice(1).map((tag) => (
              <span
                key={tag.value}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  TAG_STYLES[tag.value] ?? "border-ink/10 bg-ink/10 text-ink"
                )}
              >
                {tag.label}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            aria-label="В избранное"
            className="shrink-0 text-muted transition hover:text-danger"
          >
            <Heart className={cn("h-4 w-4", liked && "fill-danger text-danger")} />
          </button>
        </div>

        <button type="button" onClick={onOpen} disabled={isOutOfStock} className="mt-1 text-left">
          <h3 className="line-clamp-1 font-serif text-base font-semibold text-cocoa">{dish.name}</h3>
          {dish.description && <p className="mt-0.5 line-clamp-2 text-xs text-muted">{dish.description}</p>}
        </button>

        <div className="mt-auto flex items-center justify-between pt-1.5">
          <span className="font-mono text-base font-semibold text-cocoa">
            {dish.price} {currency}
          </span>
          {!isOutOfStock && (
            <button
              type="button"
              onClick={onOpen}
              aria-label="Добавить в корзину"
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold text-gold-dark transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
