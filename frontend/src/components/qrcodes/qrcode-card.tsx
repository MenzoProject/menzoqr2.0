"use client";

import Image from "next/image";
import { Download, Trash2, ScanLine, Table as TableIcon, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";
import type { QrCode } from "@/types/qrcode";

interface QrCodeCardProps {
  qrCode: QrCode;
  onDelete: () => void;
}

export function QrCodeCard({ qrCode, onDelete }: QrCodeCardProps) {
  const { toast } = useToast();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrCode.public_url);
      toast({ title: "Ссылка скопирована" });
    } catch {
      toast({ title: "Не удалось скопировать ссылку", variant: "destructive" });
    }
  };

  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <div className="scan-frame flex h-40 w-40 items-center justify-center rounded-card bg-background p-3">
        {qrCode.image_url ? (
          <Image src={qrCode.image_url} alt="QR" width={140} height={140} className="h-full w-full object-contain" />
        ) : (
          <ScanLine className="h-10 w-10 text-muted" />
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <Badge variant={qrCode.type === "table" ? "accent" : "success"}>
          {qrCode.type === "table" ? (
            <>
              <TableIcon className="h-3 w-3" />
              Стол {qrCode.table?.number}
            </>
          ) : (
            "Самовывоз"
          )}
        </Badge>
        <p className="text-xs text-muted">{qrCode.scans_count} сканирований</p>
      </div>

      <div className="flex w-full items-center gap-2">
        {qrCode.image_url && (
          <Button asChild variant="secondary" size="sm" className="flex-1">
            <a href={qrCode.image_url} download target="_blank" rel="noreferrer">
              <Download className="h-3.5 w-3.5" />
              Скачать
            </a>
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-danger" />
        </Button>
      </div>

      <div className="flex w-full items-center gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={copyLink}>
          <LinkIcon className="h-3.5 w-3.5" />
          Копировать ссылку
        </Button>
        <Button asChild variant="ghost" size="icon">
          <a href={qrCode.public_url} target="_blank" rel="noreferrer" aria-label="Открыть публичное меню">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
}
