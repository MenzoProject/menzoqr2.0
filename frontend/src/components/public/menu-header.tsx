"use client";

import Image from "next/image";
import { Store } from "lucide-react";
import type { PublicCafe } from "@/types/public-menu";

export function MenuHeader({ cafe }: { cafe: PublicCafe }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/85 px-4 py-3 backdrop-blur-glass">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-card bg-background">
          {cafe.logo_url ? (
            <Image src={cafe.logo_url} alt={cafe.name} width={44} height={44} className="h-full w-full object-cover" />
          ) : (
            <Store className="h-5 w-5 text-muted" />
          )}
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-base font-semibold text-ink">{cafe.name}</h1>
          {cafe.address && <p className="truncate text-xs text-muted">{cafe.address}</p>}
        </div>
      </div>
    </header>
  );
}
