"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { Store, Utensils, ShoppingBag, ChevronRight, Flame, UtensilsCrossed } from "lucide-react";
import { usePublicMenu } from "@/hooks/use-public-menu";
import { CartProvider } from "@/providers/cart-provider";
import { HeroBanner } from "@/components/public/hero-banner";
import { ComboOfferCard } from "@/components/public/combo-offer-card";
import { DishTile } from "@/components/public/dish-tile";
import { DishBottomSheet } from "@/components/public/dish-bottom-sheet";
import { CartBar } from "@/components/public/cart-bar";
import { CartSheet } from "@/components/public/cart-sheet";
import { CheckoutSheet } from "@/components/public/checkout-sheet";
import { PublicBottomNav } from "@/components/public/public-bottom-nav";
import { MenuSkeleton } from "@/components/public/menu-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { Dish } from "@/types/menu";

function HomeContent({ cafeSlug }: { cafeSlug: string }) {
  const searchParams = useSearchParams();
  const { data: cafe, isLoading, isError } = usePublicMenu(cafeSlug);

  const tableIdParam = searchParams.get("table_id");
  const tableNumberParam = searchParams.get("table_number");
  const orderType = tableIdParam ? "table" : "takeaway";
  const tableId = tableIdParam ? Number(tableIdParam) : null;

  const [selectedDish, setSelectedDish] = React.useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);

  const query = searchParams.toString();
  const catalogHref = `/menu/${cafeSlug}/catalog${query ? `?${query}` : ""}`;

  if (isLoading) return <MenuSkeleton />;

  if (isError || !cafe) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <EmptyState icon={Store} title="Меню не найдено" description="Проверьте ссылку или QR-код и попробуйте снова." />
      </div>
    );
  }

  const visibleCategories = cafe.categories.filter((c) => c.is_active && c.dishes.some((d) => d.is_active));
  const popularDishes = visibleCategories
    .flatMap((c) => c.dishes)
    .filter((d) => d.is_active && d.is_popular)
    .slice(0, 10);
  const activeCombo = cafe.combo_offers.find((c) => c.is_active) ?? null;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gold/15 bg-cream/90 px-4 py-3 backdrop-blur-glass">
        <div className="mx-auto flex max-w-lg items-center gap-3 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-card bg-cream-dark">
            {cafe.logo_url ? (
              <Image src={cafe.logo_url} alt={cafe.name} width={44} height={44} className="h-full w-full object-cover" />
            ) : (
              <Store className="h-5 w-5 text-gold-dark" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-base font-semibold text-cocoa">{cafe.name}</h1>
            {cafe.address && <p className="truncate text-xs text-muted">{cafe.address}</p>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg pb-28 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        <HeroBanner cafe={cafe} banners={cafe.banners} />

        <div className="mt-4 grid grid-cols-2 gap-3 px-4">
          <Link
            href={catalogHref}
            className="flex items-center gap-3 rounded-card-lg bg-gold px-4 py-3.5 text-white shadow-soft transition active:scale-[0.98]"
          >
            <Utensils className="h-5 w-5 shrink-0" />
            <span className="flex flex-col text-left leading-tight">
              <span className="text-sm font-semibold">Заказать за столом</span>
              <span className="text-xs text-white/80">Принесём к вашему столу</span>
            </span>
          </Link>
          <Link
            href={catalogHref}
            className="flex items-center gap-3 rounded-card-lg border border-gold/25 bg-white px-4 py-3.5 text-cocoa shadow-soft transition active:scale-[0.98]"
          >
            <ShoppingBag className="h-5 w-5 shrink-0 text-gold-dark" />
            <span className="flex flex-col text-left leading-tight">
              <span className="text-sm font-semibold">Самовывоз</span>
              <span className="text-xs text-muted">Заберите заказ сами</span>
            </span>
          </Link>
        </div>

        {visibleCategories.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="font-serif text-lg font-semibold text-cocoa">Категории</h2>
              <Link href={catalogHref} className="flex items-center gap-0.5 text-sm font-medium text-gold-dark">
                Все категории
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibleCategories.map((category) => {
                const thumb = category.dishes.find((d) => d.image_url)?.image_url ?? null;

                return (
                  <Link
                    key={category.id}
                    href={`${catalogHref}${query ? "&" : "?"}category=${category.id}`}
                    className="flex w-[110px] shrink-0 flex-col items-center gap-2 rounded-card-lg border border-gold/15 bg-white p-3 text-center shadow-soft"
                  >
                    <div className="relative h-14 w-14 overflow-hidden rounded-full bg-cream-dark">
                      {thumb ? (
                        <Image src={thumb} alt={category.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <UtensilsCrossed className="h-5 w-5 text-gold-dark/60" />
                        </div>
                      )}
                    </div>
                    <span className="line-clamp-2 text-xs font-medium leading-tight text-cocoa">{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {popularDishes.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="flex items-center gap-1.5 font-serif text-lg font-semibold text-cocoa">
                <Flame className="h-5 w-5 text-gold" />
                Популярные блюда
              </h2>
              <Link href={catalogHref} className="flex items-center gap-0.5 text-sm font-medium text-gold-dark">
                Смотреть все
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {popularDishes.map((dish, index) => (
                <div key={dish.id} className="w-[160px] shrink-0">
                  <DishTile dish={dish} currency={cafe.currency} index={index} onOpen={() => setSelectedDish(dish)} />
                </div>
              ))}
            </div>
          </section>
        )}

        {activeCombo && (
          <section className="mt-6">
            <ComboOfferCard combo={activeCombo} currency={cafe.currency} />
          </section>
        )}
      </main>

      <CartBar currency={cafe.currency} onOpen={() => setCartOpen(true)} />

      <PublicBottomNav cafeSlug={cafeSlug} active="home" onCartClick={() => setCartOpen(true)} />

      <DishBottomSheet dish={selectedDish} currency={cafe.currency} onOpenChange={(open) => !open && setSelectedDish(null)} />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        currency={cafe.currency}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutSheet
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cafeSlug={cafeSlug}
        currency={cafe.currency}
        orderType={orderType}
        tableId={tableId}
        tableNumber={tableNumberParam}
      />
    </>
  );
}

export default function PublicHomePage() {
  const params = useParams<{ cafeSlug: string }>();

  return (
    <React.Suspense fallback={<MenuSkeleton />}>
      <CartProvider cafeSlug={params.cafeSlug}>
        <HomeContent cafeSlug={params.cafeSlug} />
      </CartProvider>
    </React.Suspense>
  );
}
