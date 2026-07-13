export interface Cafe {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  currency: string;
  is_active: boolean;
  created_at: string;
}
