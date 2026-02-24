/** Order status values (used with SQLite; Prisma enum not available) */
export const OrderStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ORDER_STATUS_VALUES = Object.values(OrderStatus);
