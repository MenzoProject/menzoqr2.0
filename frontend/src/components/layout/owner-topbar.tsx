"use client";

import Link from "next/link";
import { UserMenu } from "@/components/layout/user-menu";

export function OwnerTopbar() {
  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/80 px-6 backdrop-blur-glass">
      <Link href="/cafes" className="font-display text-lg font-medium tracking-tight text-ink">
        MENZO <span className="text-accent">QR</span>
      </Link>

      <UserMenu />
    </header>
  );
}
