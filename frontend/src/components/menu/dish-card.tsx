"use client";

import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditDeleteMenu } from "@/components/shared/edit-delete-menu";
import type { Dish } from "@/types/menu";

interface DishCardProps {
  dish: Dish;
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function DishCard({ dish, currency, onEdit, onDelete }: DishCardProps) {
  return (
    <Card className="flex gap-4 p-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-card bg-background">
        {dish.image_url ? (
          <Image src={dish.image_url} alt={dish.name} width={80} height={80} className="h-full w-full object-cover" />
        ) : (
          <UtensilsCrossed className="h-6 w-6 text-muted" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-ink">{dish.name}</h4>
            <EditDeleteMenu onEdit={onEdit} onDelete={onDelete} />
          </div>
          {dish.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{dish.description}</p>}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-sm font-medium text-ink">
            {dish.price} {currency}
          </span>
          {!dish.is_active && <Badge variant="default">Скрыто</Badge>}
          {!dish.is_available && <Badge variant="warning">Нет в наличии</Badge>}
          {dish.tags.map((tag) => (
            <Badge key={tag.value} variant="accent">
              {tag.label}
            </Badge>
          ))}
          {dish.variants.length > 0 && <Badge variant="default">{dish.variants.length} вариантов</Badge>}
          {dish.addons.length > 0 && <Badge variant="default">{dish.addons.length} допов</Badge>}
        </div>
      </div>
    </Card>
  );
}
