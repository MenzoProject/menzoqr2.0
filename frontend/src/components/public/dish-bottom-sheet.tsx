"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, UtensilsCrossed } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/providers/toast-provider";
import type { Dish } from "@/types/menu";

interface DishBottomSheetProps {
  dish: Dish | null;
  currency: string;
  onOpenChange: (open: boolean) => void;
}

export function DishBottomSheet({ dish, currency, onOpenChange }: DishBottomSheetProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  // Keep rendering the last dish while the sheet plays its close animation,
  // even after the parent clears the `dish` prop to null.
  const [displayedDish, setDisplayedDish] = React.useState<Dish | null>(null);
  const [variantId, setVariantId] = React.useState<number | null>(null);
  const [addonIds, setAddonIds] = React.useState<number[]>([]);
  const [quantity, setQuantity] = React.useState(1);
  const [comment, setComment] = React.useState("");

  React.useEffect(() => {
    if (dish) {
      setDisplayedDish(dish);
      setVariantId(dish.variants[0]?.id ?? null);
      setAddonIds([]);
      setQuantity(1);
      setComment("");
    }
  }, [dish]);

  const isOpen = Boolean(dish);

  const selectedVariant = displayedDish?.variants.find((v) => v.id === variantId) ?? null;
  const selectedAddons = displayedDish?.addons.filter((a) => addonIds.includes(a.id)) ?? [];

  const unitPrice = (displayedDish?.price ?? 0) + (selectedVariant?.price_modifier ?? 0);
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const total = (unitPrice + addonsTotal) * quantity;

  const toggleAddon = (id: number) => {
    setAddonIds((current) => (current.includes(id) ? current.filter((a) => a !== id) : [...current, id]));
  };

  const handleAdd = () => {
    if (!displayedDish) return;

    addItem({
      dishId: displayedDish.id,
      dishName: displayedDish.name,
      dishImageUrl: displayedDish.image_url,
      unitPrice,
      quantity,
      variant: selectedVariant
        ? { id: selectedVariant.id, name: selectedVariant.name, price_modifier: selectedVariant.price_modifier }
        : null,
      addons: selectedAddons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
      comment: comment.trim() || null,
    });
    toast({ title: `${displayedDish.name} добавлено в корзину` });
    onOpenChange(false);
  };

  return (
    <BottomSheet open={isOpen} onOpenChange={onOpenChange} title={displayedDish?.name ?? "Блюдо"} className="pb-4">
      {displayedDish && (
        <>
          <div className="relative -mx-5 -mt-1 mb-4 aspect-[16/10] w-[calc(100%+40px)] overflow-hidden bg-background">
            {displayedDish.image_url ? (
              <Image
                src={displayedDish.image_url}
                alt={displayedDish.name}
                fill
                sizes="480px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <UtensilsCrossed className="h-10 w-10 text-muted" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                {displayedDish.tags.map((tag) => (
                  <Badge key={tag.value} variant="accent">
                    {tag.label}
                  </Badge>
                ))}
              </div>
              <h2 className="mt-1.5 font-display text-xl font-semibold text-ink">{displayedDish.name}</h2>
              {displayedDish.description && <p className="mt-1 text-sm text-muted">{displayedDish.description}</p>}
            </div>

            {displayedDish.variants.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-ink">Вариант</span>
                <div className="flex flex-wrap gap-2">
                  {displayedDish.variants.map((variant) => {
                    const isSelected = variant.id === variantId;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setVariantId(variant.id)}
                        className={cn(
                          "min-h-[44px] rounded-card border px-4 text-sm font-medium transition-colors",
                          isSelected
                            ? "border-accent bg-accent/8 text-accent"
                            : "border-border text-ink hover:bg-ink/5"
                        )}
                      >
                        {variant.name}
                        {variant.price_modifier !== 0 && (
                          <span className="ml-1.5 text-xs text-muted">
                            {variant.price_modifier > 0 ? "+" : ""}
                            {variant.price_modifier}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {displayedDish.addons.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-ink">Дополнения</span>
                <div className="flex flex-col gap-2">
                  {displayedDish.addons.map((addon) => {
                    const isSelected = addonIds.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={cn(
                          "flex min-h-[44px] items-center justify-between rounded-card border px-4 transition-colors",
                          isSelected ? "border-accent bg-accent/8" : "border-border hover:bg-ink/5"
                        )}
                      >
                        <span className="text-sm text-ink">{addon.name}</span>
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted">+{addon.price}</span>
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border",
                              isSelected ? "border-accent bg-accent text-white" : "border-border"
                            )}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink">Комментарий</span>
              <Textarea
                placeholder="Например: без лука"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="sticky bottom-0 -mx-5 mt-6 flex items-center gap-3 border-t border-border bg-white px-5 pt-4">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
              <Button onClick={handleAdd} size="lg" className="w-full" disabled={!displayedDish.is_available}>
                Добавить · {total.toFixed(0)} {currency}
              </Button>
            </motion.div>
          </div>
        </>
      )}
    </BottomSheet>
  );
}
