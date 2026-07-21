export interface ComboOffer {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  original_price: number | null;
  sort_order: number;
  is_active: boolean;
}
