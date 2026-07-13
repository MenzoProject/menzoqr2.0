export type OrderType = "takeaway" | "table";

export type OrderStatus = "new" | "accepted" | "preparing" | "ready" | "delivered" | "cancelled";

export type PaymentMethod = "cash" | "online";

export interface OrderItemAddon {
  id: number;
  name: string;
  price: number;
}

export interface OrderItem {
  id: number;
  dish_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  comment: string | null;
  addons: OrderItemAddon[];
}

export interface OrderTable {
  id: number;
  number: string;
}

export interface Order {
  id: number;
  order_number: string;
  type: OrderType;
  type_label: string;
  status: OrderStatus;
  status_label: string;
  table: OrderTable | null;
  customer_name: string;
  customer_phone: string;
  comment: string | null;
  payment_method: PaymentMethod;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Новый" },
  { value: "accepted", label: "Принят" },
  { value: "preparing", label: "Готовится" },
  { value: "ready", label: "Готов" },
  { value: "delivered", label: "Выдан" },
  { value: "cancelled", label: "Отменен" },
];

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  new: ["accepted", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};
