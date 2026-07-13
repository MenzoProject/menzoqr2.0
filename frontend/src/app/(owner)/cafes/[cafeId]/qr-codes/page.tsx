"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Plus, QrCode as QrCodeIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQrCodes, useDeleteQrCode } from "@/hooks/use-qrcodes";
import { QrCodeFormDialog } from "@/components/qrcodes/qrcode-form-dialog";
import { QrCodeCard } from "@/components/qrcodes/qrcode-card";
import { useToast } from "@/providers/toast-provider";
import type { QrCode } from "@/types/qrcode";

export default function QrCodesPage() {
  const params = useParams<{ cafeId: string }>();
  const { data: qrCodes, isLoading } = useQrCodes(params.cafeId);
  const deleteQrCode = useDeleteQrCode(params.cafeId);
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<QrCode | null>(null);

  return (
    <div>
      <PageHeader
        title="QR-коды"
        description="Создавайте коды для столов и самовывоза — гости сканируют их, чтобы открыть меню и сделать заказ."
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Новый QR-код
          </Button>
        }
      />

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((key) => (
            <Card key={key} className="flex flex-col items-center gap-4">
              <Skeleton className="h-40 w-40 rounded-card" />
              <Skeleton className="h-4 w-20" />
            </Card>
          ))}
        </div>
      )}

      {!isLoading && qrCodes?.length === 0 && (
        <EmptyState
          icon={QrCodeIcon}
          title="Пока нет QR-кодов"
          description="Создайте код для стола или самовывоза — он будет вести на публичное меню вашего кафе."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Создать QR-код
            </Button>
          }
        />
      )}

      {!isLoading && qrCodes && qrCodes.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {qrCodes.map((qrCode) => (
            <QrCodeCard key={qrCode.id} qrCode={qrCode} onDelete={() => setDeleteTarget(qrCode)} />
          ))}
        </div>
      )}

      <QrCodeFormDialog cafeId={params.cafeId} open={dialogOpen} onOpenChange={setDialogOpen} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить этот QR-код?"
        description="Гости больше не смогут открыть меню по этому коду."
        isLoading={deleteQrCode.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteQrCode.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast({ title: "QR-код удален" });
              setDeleteTarget(null);
            },
          });
        }}
      />
    </div>
  );
}
