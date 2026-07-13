import type { CartItemAddon, CartItemVariant } from "@/types/cart";

/**
 * Builds a stable identity key for a cart line so that adding the same dish
 * with the same variant/addons/comment increments quantity instead of
 * creating a duplicate row, while a different configuration creates a new one.
 */
export function buildCartItemKey(
  dishId: number,
  variant: CartItemVariant | null,
  addons: CartItemAddon[],
  comment: string | null
): string {
  const addonKey = addons
    .map((addon) => addon.id)
    .sort((a, b) => a - b)
    .join(",");

  return [dishId, variant?.id ?? "none", addonKey, comment?.trim() ?? ""].join("|");
}
