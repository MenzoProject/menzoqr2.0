"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Store } from "lucide-react";import { usePublicMenu } from "@/hooks/use-public-menu";
import { CartProvider } from "@/providers/cart-provider";
import { MenuHeader } from "@/components/public/menu-header";
import { MenuSkeleton } from "@/components/public/menu-skeleton";
import { CategoryNav } from "@/components/public/category-nav";
import { DishTile } from "@/components/public/dish-tile";
import { DishBottomSheet } from "@/components/public/dish-bottom-sheet";
import { CartBar } from "@/components/public/cart-bar";
import { CartSheet } from "@/components/public/cart-sheet";
import { CheckoutSheet } from "@/components/public/checkout-sheet";
import { EmptyState } from "@/components/shared/empty-state";
import type { Dish } from "@/types/menu";

function MenuContent({ cafeSlug }: { cafeSlug: string }) {
  const searchParams = useSearchParams();
  const { data: cafe, isLoading, isError } = usePublicMenu(cafeSlug);

  const tableIdParam = searchParams.get("table_id");
  const tableNumberParam = searchParams.get("table_number");
  const orderType = tableIdParam ? "table" : "takeaway";
  const tableId = tableIdParam ? Number(tableIdParam) : null;

  const visibleCategories = React.useMemo(
    () => cafe?.categories.filter((c) => c.is_active && c.dishes.some((d) => d.is_active)) ?? [],
    [cafe]
  );

  const [activeCategoryId, setActiveCategoryId] = React.useState<number | null>(null);
  const [selectedDish, setSelectedDish] = React.useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);

  const sectionRefs = React.useRef<Map<number, HTMLElement>>(new Map());

  React.useEffect(() => {
    if (visibleCategories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(visibleCategories[0]!.id);
    }
  }, [visibleCategories, activeCategoryId]);

  React.useEffect(() => {
    if (visibleCategories.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          const id = Number(visible[0].target.getAttribute("data-category-id"));
          setActiveCategoryId(id);
        }
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [visibleCategories]);

  const scrollToCategory = (id: number) => {
    const node = sectionRefs.current.get(id);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) return <MenuSkeleton />;

  if (isError || !cafe) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <EmptyState icon={Store} title="Меню не найдено" description="Проверьте ссылку или QR-код и попробуйте снова." />
      </div>
    );
  }

  return (
    <CartProvider cafeSlug={cafeSlug}>
      <MenuHeader cafe={cafe} />

      <div className="sticky top-[65px] z-20 border-b border-border/70 bg-background/95 backdrop-blur-glass">
        <div className="mx-auto max-w-lg sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
          <CategoryNav
            categories={visibleCategories.map((c) => ({ id: c.id, name: c.name }))}
            activeCategoryId={activeCategoryId}
            onSelect={scrollToCategory}
          />
        </div>
      </div>

      <main className="mx-auto max-w-lg px-4 pb-32 pt-2 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        {visibleCategories.length === 0 && (
          <div className="py-16">
            <EmptyState icon={Store} title="Меню пока пусто" description="Загляните позже — заведение обновляет меню." />
          </div>
        )}

        {visibleCategories.map((category) => (
          <section
            key={category.id}
            data-category-id={category.id}
            ref={(node) => {
              if (node) sectionRefs.current.set(category.id, node);
            }}
            className="scroll-mt-[130px] py-5"
          >
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">{category.name}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {category.dishes
                .filter((dish) => dish.is_active)
                .map((dish, index) => (
                  <DishTile
                    key={dish.id}
                    dish={dish}
                    currency={cafe.currency}
                    index={index}
                    onOpen={() => setSelectedDish(dish)}
                  />
                ))}
            </div>
          </section>
        ))}
      </main>

      <CartBar currency={cafe.currency} onOpen={() => setCartOpen(true)} />

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
    </CartProvider>
  );
}

export default function PublicMenuPage() {
  const params = useParams<{ cafeSlug: string }>();
  return (
    <React.Suspense fallback={<MenuSkeleton />}>
      <MenuContent cafeSlug={params.cafeSlug} />
    </React.Suspense>
  );
}
