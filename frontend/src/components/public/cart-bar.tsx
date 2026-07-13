"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
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
          className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-lg"
        >
          <button
            type="button"
            onClick={onOpen}
            className="flex w-full min-h-[56px] items-center justify-between rounded-full bg-ink px-5 py-3 text-white shadow-glass-lg transition active:scale-[0.98]"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                <ShoppingBag className="h-3.5 w-3.5" />
              </span>
              {itemCount} {itemCount === 1 ? "позиция" : "позиции"}
            </span>
            <span className="font-mono text-sm font-semibold">
              {subtotal.toFixed(0)} {currency}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
