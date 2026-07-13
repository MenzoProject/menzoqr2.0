"use client";

import Image from "next/image";
import { Trash2, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useCart } from "@/providers/cart-provider";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  onCheckout: () => void;
}

export function CartSheet({ open, onOpenChange, currency, onCheckout }: CartSheetProps) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Корзина" className="pb-4">
      <div className="flex flex-col gap-4 pt-1">
        <h2 className="font-display text-lg font-semibold text-ink">Корзина</h2>

        {items.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Корзина пуста" description="Добавьте блюда из меню, чтобы оформить заказ." />
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const addonsTotal = item.addons.reduce((sum, a) => sum + a.price, 0);
                const lineTotal = (item.unitPrice + addonsTotal) * item.quantity;

                return (
                  <div key={item.key} className="flex gap-3 rounded-card border border-border p-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-card bg-background">
                      {item.dishImageUrl ? (
                        <Image
                          src={item.dishImageUrl}
                          alt={item.dishName}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UtensilsCrossed className="h-5 w-5 text-muted" />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-2">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-ink">{item.dishName}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/8 hover:text-danger"
                            aria-label="Удалить позицию"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {(item.variant || item.addons.length > 0) && (
                          <p className="text-xs text-muted">
                            {[item.variant?.name, ...item.addons.map((a) => a.name)].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.key, qty)}
                          className="scale-90 origin-left"
                        />
                        <span className="font-mono text-sm font-semibold text-ink">
                          {lineTotal.toFixed(0)} {currency}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sticky bottom-0 -mx-5 flex flex-col gap-3 border-t border-border bg-white px-5 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Итого</span>
                <span className="font-mono text-base font-semibold text-ink">
                  {subtotal.toFixed(0)} {currency}
                </span>
              </div>
              <Button size="lg" className="w-full" onClick={onCheckout}>
                Оформить заказ
              </Button>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
