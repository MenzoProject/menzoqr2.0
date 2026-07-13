"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  UtensilsCrossed,
  QrCode,
  ClipboardList,
  Users,
  Send,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";

interface CafeSidebarProps {
  cafeId: string;
  cafe?: Cafe;
}

const navItems = (cafeId: string) => [
  { href: `/cafes/${cafeId}/menu`, label: "Меню", icon: UtensilsCrossed },
  { href: `/cafes/${cafeId}/qr-codes`, label: "QR-коды", icon: QrCode },
  { href: `/cafes/${cafeId}/orders`, label: "Заказы", icon: ClipboardList },
  { href: `/cafes/${cafeId}/staff`, label: "Персонал", icon: Users },
  { href: `/cafes/${cafeId}/telegram`, label: "Telegram", icon: Send },
  { href: `/cafes/${cafeId}/settings`, label: "Настройки", icon: Settings },
];

export function CafeSidebar({ cafeId, cafe }: CafeSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-[72px] flex h-[calc(100vh-72px)] w-[240px] shrink-0 flex-col border-r border-border/70 bg-white/40 px-4 py-6">
      <Link
        href="/cafes"
        className="mb-6 flex items-center gap-2 rounded-card px-2 py-1.5 text-sm text-muted transition hover:bg-ink/5 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Все кафе
      </Link>

      {cafe && (
        <div className="mb-4 px-2">
          <div className="truncate text-sm font-medium text-ink" title={cafe.name}>
            {cafe.name}
          </div>
          <a
            href={`/menu/${cafe.slug}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-muted transition hover:text-accent"
          >
            <ExternalLink className="h-3 w-3" />
            Публичное меню
          </a>
        </div>
      )}

      <nav className="flex flex-col gap-1">
        {navItems(cafeId).map((item) => {
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-accent/10 text-accent" : "text-muted hover:bg-ink/5 hover:text-ink"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
