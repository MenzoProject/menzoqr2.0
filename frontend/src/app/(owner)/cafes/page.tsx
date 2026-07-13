"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Store, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCafes } from "@/hooks/use-cafes";
import { CafeFormDialog } from "@/components/cafes/cafe-form-dialog";

export default function CafesPage() {
  const { data: cafes, isLoading } = useCafes();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div>
      <PageHeader
        title="Ваши кафе"
        description="Выберите заведение, чтобы управлять меню, QR-кодами и заказами."
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Новое кафе
          </Button>
        }
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <Card key={key} className="h-[140px]">
              <Skeleton className="mb-3 h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      )}

      {!isLoading && cafes?.length === 0 && (
        <EmptyState
          icon={Store}
          title="Пока нет ни одного кафе"
          description="Создайте первое заведение, чтобы настроить меню и начать принимать заказы по QR."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Создать кафе
            </Button>
          }
        />
      )}

      {!isLoading && cafes && cafes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cafes.map((cafe) => (
            <Link key={cafe.id} href={`/cafes/${cafe.id}/menu`}>
              <Card className="h-full transition-shadow hover:shadow-glass-lg">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-card bg-accent/8 text-accent">
                    <Store className="h-5 w-5" />
                  </span>
                  <Badge variant={cafe.is_active ? "success" : "default"}>
                    {cafe.is_active ? "Активно" : "Отключено"}
                  </Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{cafe.name}</h3>
                {cafe.address && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    {cafe.address}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CafeFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
