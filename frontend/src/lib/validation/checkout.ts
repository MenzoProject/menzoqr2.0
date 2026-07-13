import { z } from "zod";
import type { OrderType } from "@/types/order";

/**
 * Both order types share the same form shape (customer_name, customer_phone,
 * comment) so react-hook-form keeps a single, stable field set — only the
 * validation strictness for customer_phone changes based on order type,
 * matching the minimal-fields checkout spec (table orders skip phone).
 */
export function buildCheckoutSchema(orderType: OrderType) {
  return z.object({
    customer_name: z.string().min(2, "Введите имя").max(255),
    customer_phone:
      orderType === "takeaway"
        ? z.string().min(5, "Введите телефон").max(30)
        : z.string().max(30).optional().or(z.literal("")),
    comment: z.string().max(1000).optional().or(z.literal("")),
  });
}

export type CheckoutFormValues = z.infer<ReturnType<typeof buildCheckoutSchema>>;
