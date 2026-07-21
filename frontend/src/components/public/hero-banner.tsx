"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Store } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types/banner";
import type { PublicCafe } from "@/types/public-menu";

interface HeroBannerProps {
  cafe: PublicCafe;
  banners: Banner[];
}

/**
 * Falls back to a plain gradient card with the cafe name when the owner
 * hasn't configured any banners yet, so the home page never looks broken.
 */
export function HeroBanner({ cafe, banners }: HeroBannerProps) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (banners.length < 2) return;

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="relative mx-4 mt-3 flex aspect-[4/3] items-end overflow-hidden rounded-card-lg bg-gradient-to-br from-gold to-gold-dark p-6 text-white sm:aspect-[21/9]">
        <div className="flex flex-col gap-1">
          <Store className="h-6 w-6 opacity-80" />
          <h1 className="font-serif text-2xl font-semibold">{cafe.name}</h1>
          {cafe.address && <p className="text-sm text-white/80">{cafe.address}</p>}
        </div>
      </div>
    );
  }

  const banner = banners[index]!;

  return (
    <div className="relative mx-4 mt-3 overflow-hidden rounded-card-lg">
      <div className="relative aspect-[4/3] w-full sm:aspect-[21/9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {banner.image_url ? (
              <Image src={banner.image_url} alt={banner.title ?? cafe.name} fill priority className="object-cover" />
            ) : (
              <div className="h-full w-full bg-cream-dark" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa/75 via-cocoa/10 to-transparent" />

            {(banner.title || banner.subtitle) && (
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 text-white">
                {banner.title && <h1 className="font-serif text-xl font-semibold leading-tight sm:text-2xl">{banner.title}</h1>}
                {banner.subtitle && <p className="text-sm text-white/85">{banner.subtitle}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Слайд ${i + 1}`}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-white" : "w-1.5 bg-white/50")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
