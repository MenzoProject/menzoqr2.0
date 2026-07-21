export interface Banner {
  id: number;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
  sort_order: number;
  is_active: boolean;
}
