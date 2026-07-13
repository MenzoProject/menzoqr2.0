import type { Category } from "@/types/menu";

export interface PublicCafe {
  name: string;
  slug: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  currency: string;
  categories: Category[];
}
