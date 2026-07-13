export interface DishVariant {
  id: number;
  name: string;
  price_modifier: number;
}

export interface DishAddon {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
}

export type DishTagValue = "new" | "hit" | "spicy" | "halal" | "vegetarian";

export interface DishTag {
  value: DishTagValue;
  label: string;
}

export interface Dish {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  is_available: boolean;
  tags: DishTag[];
  variants: DishVariant[];
  addons: DishAddon[];
}

export interface Category {
  id: number;
  name: string;
  sort_order: number;
  is_active: boolean;
  dishes: Dish[];
}

export const DISH_TAG_OPTIONS: { value: DishTagValue; label: string }[] = [
  { value: "new", label: "Новинка" },
  { value: "hit", label: "Хит" },
  { value: "spicy", label: "Острое" },
  { value: "halal", label: "Халяль" },
  { value: "vegetarian", label: "Вегетарианское" },
];
