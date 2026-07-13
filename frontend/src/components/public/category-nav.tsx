"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: { id: number; name: string }[];
  activeCategoryId: number | null;
  onSelect: (id: number) => void;
}

export function CategoryNav({ categories, activeCategoryId, onSelect }: CategoryNavProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const buttonRefs = React.useRef<Map<number, HTMLButtonElement>>(new Map());

  React.useEffect(() => {
    if (activeCategoryId === null) return;
    const button = buttonRefs.current.get(activeCategoryId);
    button?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeCategoryId]);

  return (
    <div
      ref={scrollerRef}
      className="flex gap-2 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;

        return (
          <button
            key={category.id}
            ref={(node) => {
              if (node) buttonRefs.current.set(category.id, node);
            }}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              "min-h-[44px]",
              isActive ? "text-white" : "text-muted hover:text-ink"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
