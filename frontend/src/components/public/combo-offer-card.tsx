"use client";

import Image from "next/image";
import { Star, Gift } from "lucide-react";
import type { ComboOffer } from "@/types/combo-offer";

export function ComboOfferCard({ combo, currency }: { combo: ComboOffer; currency: string }) {
  return (
    <div className="mx-4 flex items-center gap-4 overflow-hidden rounded-card-lg bg-gold/10 p-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex items-center gap-1.5 font-serif text-base font-semibold text-gold-dark">
          <Star className="h-4 w-4 fill-gold-dark text-gold-dark" />
          {combo.title}
        </span>
        {combo.description && <p className="text-xs text-muted">{combo.description}</p>}
        <div className="mt-1 flex items-center gap-2 font-mono">
          <span className="rounded-full bg-gold px-2.5 py-1 text-sm font-semibold text-white">
            {combo.price} {currency}
          </span>
          {combo.original_price && (
            <span className="text-sm text-muted line-through">
              {combo.original_price} {currency}
            </span>
          )}
        </div>
      </div>

      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-card bg-white">
        {combo.image_url ? (
          <Image src={combo.image_url} alt={combo.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Gift className="h-7 w-7 text-gold" />
          </div>
        )}
      </div>
    </div>
  );
}
