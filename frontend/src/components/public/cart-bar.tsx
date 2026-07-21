"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "@/providers/cart-provider";

interface CartBarProps {
  currency: string;
  onOpen: () => void;
}

export function CartBar({ currency, onOpen }: CartBarProps) {
  const { itemCount, subtotal } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          className="fixed inset-x-0 bottom-[64px] z-40 border-t border-gold/15 bg-white/97 backdrop-blur-glass"
        >
          <button
            type="button"
            onClick={onOpen}
            className="mx-auto flex min-h-[64px] w-full max-w-lg items-center justify-between gap-4 px-4 py-3 text-left transition active:opacity-80 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/12 text-gold-dark">
                <ShoppingBag className="h-4 w-4" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-xs text-muted">
                  {itemCount} {itemCount === 1 ? "блюдо" : "блюда"}
                </span>
                <span className="font-mono text-sm font-semibold text-cocoa">
                  {subtotal.toFixed(0)} {currency}
                </span>
              </span>
            </span>

            <span className="flex items-center gap-1 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-white shadow-soft">
              Перейти к заказу
              <ChevronRight className="h-4 w-4" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
