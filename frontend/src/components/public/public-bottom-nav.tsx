"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";

interface PublicBottomNavProps {
  cafeSlug: string;
  active: "home" | "catalog" | "about";
  onCartClick?: () => void;
}

export function PublicBottomNav({ cafeSlug, active, onCartClick }: PublicBottomNavProps) {
  const searchParams = useSearchParams();
  const { itemCount } = useCart();
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : "";

  const items = [
    { key: "home" as const, label: "Главная", icon: Home, href: `/menu/${cafeSlug}${suffix}` },
    { key: "catalog" as const, label: "Меню", icon: LayoutGrid, href: `/menu/${cafeSlug}/catalog${suffix}` },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/15 bg-white/97 backdrop-blur-glass">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1.5 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        {items.map((item) => {
          const isActive = active === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-card text-[11px] font-medium transition-colors",
                isActive ? "text-gold-dark" : "text-muted hover:text-cocoa"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onCartClick}
          className={cn(
            "relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-card text-[11px] font-medium transition-colors",
            "text-muted hover:text-cocoa"
          )}
        >
          <span className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </span>
          Корзина
        </button>

        <Link
          href={`/menu/${cafeSlug}/about${suffix}`}
          className={cn(
            "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-card text-[11px] font-medium transition-colors",
            active === "about" ? "text-gold-dark" : "text-muted hover:text-cocoa"
          )}
        >
          <Info className="h-5 w-5" />
          О кафе
        </Link>
      </div>
    </nav>
  );
}
