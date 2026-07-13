"use client";

import { Plus, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { EditDeleteMenu } from "@/components/shared/edit-delete-menu";
import { DishCard } from "@/components/menu/dish-card";
import type { Category, Dish } from "@/types/menu";

interface CategorySectionProps {
  category: Category;
  currency: string;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onAddDish: () => void;
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dish: Dish) => void;
}

export function CategorySection({
  category,
  currency,
  onEditCategory,
  onDeleteCategory,
  onAddDish,
  onEditDish,
  onDeleteDish,
}: CategorySectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">{category.name}</h2>
          {!category.is_active && <Badge variant="default">Скрыта</Badge>}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onAddDish}>
            <Plus className="h-3.5 w-3.5" />
            Блюдо
          </Button>
          <EditDeleteMenu
            onEdit={onEditCategory}
            onDelete={onDeleteCategory}
            editLabel="Изменить категорию"
            deleteLabel="Удалить категорию"
          />
        </div>
      </div>

      {category.dishes.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} title="В категории пока нет блюд" action={
          <Button size="sm" onClick={onAddDish}>
            <Plus className="h-3.5 w-3.5" />
            Добавить блюдо
          </Button>
        } />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {category.dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              currency={currency}
              onEdit={() => onEditDish(dish)}
              onDelete={() => onDeleteDish(dish)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
