"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { MapPin, Phone, Store } from "lucide-react";
import { usePublicMenu } from "@/hooks/use-public-menu";
import { CartProvider } from "@/providers/cart-provider";
import { MenuHeader } from "@/components/public/menu-header";
import { MenuSkeleton } from "@/components/public/menu-skeleton";
import { CartBar } from "@/components/public/cart-bar";
import { CartSheet } from "@/components/public/cart-sheet";
import { CheckoutSheet } from "@/components/public/checkout-sheet";
import { PublicBottomNav } from "@/components/public/public-bottom-nav";
import { EmptyState } from "@/components/shared/empty-state";

function AboutContent({ cafeSlug }: { cafeSlug: string }) {
  const searchParams = useSearchParams();
  const { data: cafe, isLoading, isError } = usePublicMenu(cafeSlug);

  const tableIdParam = searchParams.get("table_id");
  const tableNumberParam = searchParams.get("table_number");
  const orderType = tableIdParam ? "table" : "takeaway";
  const tableId = tableIdParam ? Number(tableIdParam) : null;

  const [cartOpen, setCartOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);

  if (isLoading) return <MenuSkeleton />;

  if (isError || !cafe) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <EmptyState icon={Store} title="Кафе не найдено" description="Проверьте ссылку или QR-код и попробуйте снова." />
      </div>
    );
  }

  return (
    <CartProvider cafeSlug={cafeSlug}>
      <MenuHeader cafe={cafe} backHref={`/menu/${cafeSlug}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`} />

      <main className="mx-auto max-w-lg px-4 pb-40 pt-5 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        <h1 className="mb-4 font-serif text-2xl font-semibold text-cocoa">О нашем кафе</h1>

        <div className="flex flex-col gap-3 rounded-card-lg border border-gold/15 bg-white p-4">
          {cafe.address && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-gold-dark" />
              <span className="text-sm text-cocoa">{cafe.address}</span>
            </div>
          )}
          {cafe.phone && (
            <a href={`tel:${cafe.phone}`} className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold-dark" />
              <span className="text-sm text-cocoa">{cafe.phone}</span>
            </a>
          )}
          {!cafe.address && !cafe.phone && (
            <p className="text-sm text-muted">Владелец пока не заполнил контактные данные кафе.</p>
          )}
        </div>
      </main>

      <CartBar currency={cafe.currency} onOpen={() => setCartOpen(true)} />
      <PublicBottomNav cafeSlug={cafeSlug} active="about" onCartClick={() => setCartOpen(true)} />

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

export default function AboutCafePage() {
  const params = useParams<{ cafeSlug: string }>();

  return (
    <React.Suspense fallback={<MenuSkeleton />}>
      <AboutContent cafeSlug={params.cafeSlug} />
    </React.Suspense>
  );
}
