"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Store, ArrowLeft } from "lucide-react";
import type { PublicCafe } from "@/types/public-menu";

export function MenuHeader({ cafe, backHref }: { cafe: PublicCafe; backHref?: string }) {
  const [logoFailed, setLogoFailed] = React.useState(false);
  const showLogo = Boolean(cafe.logo_url) && !logoFailed;

  return (
    <header className="sticky top-0 z-30 border-b border-gold/15 bg-cream/90 px-4 py-3 backdrop-blur-glass">
      <div className="mx-auto flex max-w-lg items-center gap-3 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        {backHref && (
          <Link
            href={backHref}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card border border-gold/25 bg-white text-cocoa transition hover:bg-gold/10"
            aria-label="На главную"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-card bg-cream-dark">
          {showLogo ? (
            <Image
              src={cafe.logo_url!}
              alt={cafe.name}
              width={44}
              height={44}
              className="h-full w-full object-cover"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <Store className="h-5 w-5 text-gold-dark" />
          )}
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-serif text-base font-semibold text-cocoa">{cafe.name}</h1>
          {cafe.address && <p className="truncate text-xs text-muted">{cafe.address}</p>}
        </div>
      </div>
    </header>
  );
}
