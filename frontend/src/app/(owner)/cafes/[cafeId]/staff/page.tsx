"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Plus, Users, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStaff, useDeleteStaff } from "@/hooks/use-staff";
import { StaffFormDialog } from "@/components/staff/staff-form-dialog";
import { useToast } from "@/providers/toast-provider";
import type { User } from "@/types/user";

export default function StaffPage() {
  const params = useParams<{ cafeId: string }>();
  const { data: staff, isLoading } = useStaff(params.cafeId);
  const deleteStaff = useDeleteStaff(params.cafeId);
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<User | null>(null);

  return (
    <div>
      <PageHeader
        title="Персонал"
        description="Дайте доступ менеджерам и сотрудникам без передачи логина владельца."
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Добавить сотрудника
          </Button>
        }
      />

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[0, 1].map((key) => (
            <Skeleton key={key} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!isLoading && staff?.length === 0 && (
        <EmptyState
          icon={Users}
          title="Пока нет сотрудников"
          description="Добавьте менеджеров и персонал, чтобы они могли принимать заказы и управлять меню."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Добавить сотрудника
            </Button>
          }
        />
      )}

      {!isLoading && staff && staff.length > 0 && (
        <div className="flex flex-col gap-3">
          {staff.map((member) => (
            <Card key={member.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-ink">{member.name}</p>
                <p className="text-sm text-muted">{member.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(member)}>
                <Trash2 className="h-4 w-4 text-danger" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <StaffFormDialog cafeId={params.cafeId} open={dialogOpen} onOpenChange={setDialogOpen} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Убрать «${deleteTarget?.name}» из кафе?`}
        description="Сотрудник потеряет доступ к панели этого заведения."
        isLoading={deleteStaff.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteStaff.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast({ title: "Сотрудник удален" });
              setDeleteTarget(null);
            },
          });
        }}
      />
    </div>
  );
}
