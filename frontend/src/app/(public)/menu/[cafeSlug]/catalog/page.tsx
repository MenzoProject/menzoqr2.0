"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Store, ChevronDown, Gift } from "lucide-react";
import { usePublicMenu } from "@/hooks/use-public-menu";
import { CartProvider } from "@/providers/cart-provider";
import { MenuHeader } from "@/components/public/menu-header";
import { MenuSkeleton } from "@/components/public/menu-skeleton";
import { CategorySidebar } from "@/components/public/category-sidebar";
import { DishListItem } from "@/components/public/dish-list-item";
import { DishBottomSheet } from "@/components/public/dish-bottom-sheet";
import { CartBar } from "@/components/public/cart-bar";
import { CartSheet } from "@/components/public/cart-sheet";
import { CheckoutSheet } from "@/components/public/checkout-sheet";
import { PublicBottomNav } from "@/components/public/public-bottom-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import type { Dish } from "@/types/menu";

const PAGE_SIZE = 4;

function MenuContent({ cafeSlug }: { cafeSlug: string }) {
  const searchParams = useSearchParams();
  const { data: cafe, isLoading, isError } = usePublicMenu(cafeSlug);

  const tableIdParam = searchParams.get("table_id");
  const tableNumberParam = searchParams.get("table_number");
  const orderType = tableIdParam ? "table" : "takeaway";
  const tableId = tableIdParam ? Number(tableIdParam) : null;

  const [halalOnly, setHalalOnly] = React.useState(false);

  const visibleCategories = React.useMemo(() => {
    const categories = cafe?.categories.filter((c) => c.is_active && c.dishes.some((d) => d.is_active)) ?? [];

    if (!halalOnly) return categories;

    return categories
      .map((c) => ({ ...c, dishes: c.dishes.filter((d) => d.tags.some((t) => t.value === "halal")) }))
      .filter((c) => c.dishes.length > 0);
  }, [cafe, halalOnly]);

  const hasAnyHalalDish = React.useMemo(
    () => (cafe?.categories ?? []).some((c) => c.dishes.some((d) => d.tags.some((t) => t.value === "halal"))),
    [cafe]
  );

  const [activeCategoryId, setActiveCategoryId] = React.useState<number | null>(null);
  const [selectedDish, setSelectedDish] = React.useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<number>>(new Set());

  const sectionRefs = React.useRef<Map<number, HTMLElement>>(new Map());

  React.useEffect(() => {
    if (visibleCategories.length > 0 && activeCategoryId === null) {
      const categoryParam = searchParams.get("category");
      const requested = categoryParam ? Number(categoryParam) : null;
      const match = requested && visibleCategories.some((c) => c.id === requested);
      setActiveCategoryId(match ? requested : visibleCategories[0]!.id);
    }
  }, [visibleCategories, activeCategoryId, searchParams]);

  React.useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (!categoryParam || visibleCategories.length === 0) return;

    const id = Number(categoryParam);
    const node = sectionRefs.current.get(id);
    if (node) {
      node.scrollIntoView({ behavior: "auto", block: "start" });
    }
    // Only run once per navigation, when the sections have mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCategories.length]);

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
      { rootMargin: "-150px 0px -55% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [visibleCategories]);

  const scrollToCategory = (id: number) => {
    const node = sectionRefs.current.get(id);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleExpanded = (id: number) => {
    setExpandedCategories((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) return <MenuSkeleton />;

  if (isError || !cafe) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <EmptyState icon={Store} title="Меню не найдено" description="Проверьте ссылку или QR-код и попробуйте снова." />
      </div>
    );
  }

  const activeCombo = cafe.combo_offers.find((c) => c.is_active) ?? null;

  return (
    <CartProvider cafeSlug={cafeSlug}>
      <MenuHeader cafe={cafe} backHref={`/menu/${cafeSlug}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`} />

      <div className="mx-auto max-w-lg px-4 pt-4 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        <h1 className="font-serif text-2xl font-semibold text-cocoa">Меню</h1>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setHalalOnly(false)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              !halalOnly ? "bg-gold text-white shadow-soft" : "border border-gold/25 bg-white text-cocoa"
            )}
          >
            Все блюда
          </button>
          {hasAnyHalalDish && (
            <button
              type="button"
              onClick={() => setHalalOnly(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                halalOnly ? "bg-gold text-white shadow-soft" : "border border-gold/25 bg-white text-cocoa"
              )}
            >
              Халяль
            </button>
          )}
        </div>
      </div>

      <main className="mx-auto flex max-w-lg gap-3 px-4 pb-40 pt-4 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        {visibleCategories.length === 0 ? (
          <div className="w-full py-16">
            <EmptyState icon={Store} title="Блюда не найдены" description="Попробуйте выключить фильтр или загляните позже." />
          </div>
        ) : (
          <>
            <div className="sticky top-[80px] h-fit max-h-[calc(100vh-100px)] overflow-y-auto pb-4">
              <CategorySidebar
                categories={visibleCategories.map((c) => ({ id: c.id, name: c.name, count: c.dishes.length }))}
                activeCategoryId={activeCategoryId}
                onSelect={scrollToCategory}
              />

              {activeCombo && (
                <div className="mt-3 flex w-[104px] flex-col items-center gap-2 rounded-card-lg bg-gold/10 p-3 text-center sm:w-[128px]">
                  <Gift className="h-5 w-5 text-gold-dark" />
                  <span className="text-xs font-medium leading-tight text-cocoa">{activeCombo.title}</span>
                  <span className="font-mono text-xs font-semibold text-gold-dark">
                    {activeCombo.price} {cafe.currency}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              {visibleCategories.map((category) => {
                const dishes = category.dishes.filter((dish) => dish.is_active);
                const isExpanded = expandedCategories.has(category.id);
                const visibleDishes = isExpanded ? dishes : dishes.slice(0, PAGE_SIZE);
                const hasMore = dishes.length > PAGE_SIZE && !isExpanded;

                return (
                  <section
                    key={category.id}
                    data-category-id={category.id}
                    ref={(node) => {
                      if (node) sectionRefs.current.set(category.id, node);
                    }}
                    className="scroll-mt-[150px] pb-6"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-serif text-lg font-semibold text-cocoa">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        {category.name}
                      </span>
                      <span className="text-xs text-muted">{dishes.length} блюд</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {visibleDishes.map((dish, index) => (
                        <DishListItem
                          key={dish.id}
                          dish={dish}
                          currency={cafe.currency}
                          index={index}
                          onOpen={() => setSelectedDish(dish)}
                        />
                      ))}
                    </div>

                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(category.id)}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-card-lg border border-gold/20 bg-white py-2.5 text-sm font-medium text-gold-dark"
                      >
                        Показать ещё блюда
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    )}
                  </section>
                );
              })}
            </div>
          </>
        )}
      </main>

      <CartBar currency={cafe.currency} onOpen={() => setCartOpen(true)} />

      <PublicBottomNav cafeSlug={cafeSlug} active="catalog" onCartClick={() => setCartOpen(true)} />

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
