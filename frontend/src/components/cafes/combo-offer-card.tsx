"use client";

import Image from "next/image";
import { Pencil, Trash2, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ComboOffer } from "@/types/combo-offer";

interface ComboOfferCardProps {
  comboOffer: ComboOffer;
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function ComboOfferCard({ comboOffer, currency, onEdit, onDelete }: ComboOfferCardProps) {
  return (
    <Card className="flex gap-4 p-4">
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-card bg-background">
        {comboOffer.image_url ? (
          <Image src={comboOffer.image_url} alt={comboOffer.title} fill className="object-cover" />
        ) : (
          <Gift className="h-6 w-6 text-muted" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-ink">{comboOffer.title}</h3>
          <Badge variant={comboOffer.is_active ? "success" : "default"}>
            {comboOffer.is_active ? "Активно" : "Скрыто"}
          </Badge>
        </div>
        {comboOffer.description && <p className="line-clamp-1 text-xs text-muted">{comboOffer.description}</p>}
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="font-semibold text-ink">
            {comboOffer.price} {currency}
          </span>
          {comboOffer.original_price && (
            <span className="text-xs text-muted line-through">
              {comboOffer.original_price} {currency}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-start gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Редактировать">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Удалить">
          <Trash2 className="h-4 w-4 text-danger" />
        </Button>
      </div>
    </Card>
  );
}
