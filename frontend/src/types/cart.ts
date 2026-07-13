export interface CartItemAddon {
  id: number;
  name: string;
  price: number;
}

export interface CartItemVariant {
  id: number;
  name: string;
  price_modifier: number;
}

export interface CartItem {
  /** Unique key derived from dish + variant + addons + comment so identical configurations merge. */
  key: string;
  dishId: number;
  dishName: string;
  dishImageUrl: string | null;
  unitPrice: number;
  quantity: number;
  variant: CartItemVariant | null;
  addons: CartItemAddon[];
  comment: string | null;
}
