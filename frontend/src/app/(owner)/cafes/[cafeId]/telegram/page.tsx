"use client";

import { useParams } from "next/navigation";
import { Send, Loader2, CheckCircle2, Copy } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTelegramStatus, useConnectTelegram, useDisconnectTelegram } from "@/hooks/use-telegram";
import { useToast } from "@/providers/toast-provider";
import { extractApiErrorMessage } from "@/lib/api/client";

export default function TelegramPage() {
  const params = useParams<{ cafeId: string }>();
  const { data: status, isLoading } = useTelegramStatus(params.cafeId);
  const connect = useConnectTelegram(params.cafeId);
  const disconnect = useDisconnectTelegram(params.cafeId);
  const { toast } = useToast();

  const isConnected = status?.status === "connected";
  const isPending = status?.status === "pending";

  return (
    <div>
      <PageHeader
        title="Telegram-уведомления"
        description="Получайте уведомления о новых заказах прямо в Telegram и управляйте статусом заказа кнопками в чате."
      />

      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Send className="h-4 w-4 text-accent" />
              Статус подключения
            </CardTitle>
            {!isLoading && (
              <Badge variant={isConnected ? "success" : isPending ? "warning" : "default"}>
                {isConnected && "Подключено"}
                {isPending && "Ожидает подтверждения"}
                {!isConnected && !isPending && "Не подключено"}
              </Badge>
            )}
          </div>
          <CardDescription>
            Уведомления отправляются через общего бота MENZO. Токен и вебхук настроены на стороне сервиса — вам
            нужно только привязать чат.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {isLoading && <Skeleton className="h-24 w-full" />}

          {!isLoading && isConnected && (
            <div className="flex items-center gap-3 rounded-card bg-success/8 p-4 text-sm text-ink">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
              <span>
                Telegram подключен
                {status?.connected_at && ` с ${new Date(status.connected_at).toLocaleDateString("ru-RU")}`}. Новые
                заказы будут приходить в привязанный чат.
              </span>
            </div>
          )}

          {!isLoading && !isConnected && (
            <>
              <p className="text-sm text-muted">
                Нажмите «Получить код», затем отправьте показанную команду вашему боту MENZO в Telegram
                {process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ? (
                  <>
                    {" "}
                    (
                    <a
                      href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-accent hover:underline"
                    >
                      @{process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}
                    </a>
                    )
                  </>
                ) : (
                  ", username которого будет указан после настройки бота на Этапе 6"
                )}
                .
              </p>

              {status?.link_token && (
                <div className="flex items-center justify-between gap-3 rounded-card border border-border bg-background px-4 py-3">
                  <code className="font-mono text-sm text-ink">/start {status.link_token}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(`/start ${status.link_token}`);
                      toast({ title: "Команда скопирована" });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Button
                onClick={() =>
                  connect.mutate(undefined, {
                    onError: (error) => {
                      toast({
                        title: "Не удалось получить код",
                        description: extractApiErrorMessage(error, "Попробуйте еще раз."),
                        variant: "destructive",
                      });
                    },
                  })
                }
                disabled={connect.isPending}
                className="self-start"
              >
                {connect.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {status?.link_token ? "Обновить код" : "Получить код"}
              </Button>
            </>
          )}

          {!isLoading && isConnected && (
            <Button
              variant="outline"
              className="self-start"
              disabled={disconnect.isPending}
              onClick={() =>
                disconnect.mutate(undefined, {
                  onSuccess: () => toast({ title: "Telegram отключен" }),
                })
              }
            >
              {disconnect.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Отключить Telegram
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
