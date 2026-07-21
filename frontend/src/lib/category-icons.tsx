import {
  Soup,
  Drumstick,
  Salad,
  CupSoda,
  Cake,
  Sandwich,
  Fish,
  Pizza,
  Utensils,
  type LucideIcon,
} from "lucide-react";

const RULES: Array<{ test: RegExp; icon: LucideIcon }> = [
  { test: /суп|шурп|лагман/i, icon: Soup },
  { test: /шашл|кебаб|гриль|мангал/i, icon: Drumstick },
  { test: /салат/i, icon: Salad },
  { test: /напит|сок|чай|кофе|коктейл/i, icon: CupSoda },
  { test: /десерт|сладк|пирож|торт/i, icon: Cake },
  { test: /закус|бутерброд|сэндвич/i, icon: Sandwich },
  { test: /рыб|морепрод/i, icon: Fish },
  { test: /пицц/i, icon: Pizza },
];

/**
 * Categories don't have a dedicated icon field yet, so we infer a reasonable
 * icon from the category name. Falls back to a generic utensils icon.
 */
export function getCategoryIcon(name: string): LucideIcon {
  const match = RULES.find((rule) => rule.test.test(name));
  return match?.icon ?? Utensils;
}
