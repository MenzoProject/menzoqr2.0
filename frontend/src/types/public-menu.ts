import type { Category } from "@/types/menu";
import type { Banner } from "@/types/banner";
import type { ComboOffer } from "@/types/combo-offer";

export interface PublicCafe {
  name: string;
  slug: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  currency: string;
  categories: Category[];
  banners: Banner[];
  combo_offers: ComboOffer[];
}
