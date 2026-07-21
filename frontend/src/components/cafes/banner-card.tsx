"use client";

import Image from "next/image";
import { Pencil, Trash2, ImageOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types/banner";

interface BannerCardProps {
  banner: Banner;
  onEdit: () => void;
  onDelete: () => void;
}

export function BannerCard({ banner, onEdit, onDelete }: BannerCardProps) {
  return (
    <Card className="flex gap-4 p-4">
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-card bg-background">
        {banner.image_url ? (
          <Image src={banner.image_url} alt={banner.title ?? "Баннер"} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff className="h-5 w-5 text-muted" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-ink">{banner.title || "Без заголовка"}</h3>
          <Badge variant={banner.is_active ? "success" : "default"}>
            {banner.is_active ? "Активен" : "Скрыт"}
          </Badge>
        </div>
        {banner.subtitle && <p className="line-clamp-2 text-xs text-muted">{banner.subtitle}</p>}
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
