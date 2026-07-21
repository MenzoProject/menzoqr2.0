"use client";

import { cn } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/category-icons";

interface CategorySidebarItem {
  id: number;
  name: string;
  count: number;
}

interface CategorySidebarProps {
  categories: CategorySidebarItem[];
  activeCategoryId: number | null;
  onSelect: (id: number) => void;
}

export function CategorySidebar({ categories, activeCategoryId, onSelect }: CategorySidebarProps) {
  return (
    <nav className="flex w-[104px] shrink-0 flex-col gap-2 sm:w-[128px]">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.name);
        const isActive = category.id === activeCategoryId;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-card-lg border px-2 py-3 text-center transition-colors",
              isActive
                ? "border-gold bg-gold/10 shadow-soft"
                : "border-gold/15 bg-white hover:border-gold/30"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive ? "text-gold-dark" : "text-muted")} />
            <span className={cn("line-clamp-2 text-xs font-medium leading-tight", isActive ? "text-cocoa" : "text-muted")}>
              {category.name}
            </span>
            <span className="text-[10px] text-muted">{category.count} блюд</span>
          </button>
        );
      })}
    </nav>
  );
}
