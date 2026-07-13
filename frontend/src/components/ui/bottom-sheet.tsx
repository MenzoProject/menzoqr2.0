"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A native-feeling bottom sheet: spring slide-up on open, drag-down-to-dismiss
 * with elastic resistance, and a frosted overlay. Built on Radix Dialog for
 * focus trapping / escape / aria semantics, animated with Framer Motion.
 */
export function BottomSheet({ open, onOpenChange, title, children, className }: BottomSheetProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className={cn(
                  "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full max-w-lg flex-col",
                  "rounded-t-[28px] bg-white shadow-glass-lg outline-none",
                  className
                )}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 34, stiffness: 340 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.5 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 120 || info.velocity.y > 600) {
                    onOpenChange(false);
                  }
                }}
              >
                <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
                <div className="flex shrink-0 justify-center pb-1 pt-3">
                  <div className="h-1.5 w-10 rounded-full bg-border" />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[env(safe-area-inset-bottom)]">
                  {children}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
