import { OrderStatus } from "@prisma/client";
import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const categorySchema = z.string().min(2).max(60);

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(150).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(4000),
  logo: z.string().url().max(500),
  category: categorySchema,
  price: z.number().positive().max(100_000_000),
  currency: z.string().min(3).max(6).default("UZS"),
  duration: z.string().min(2).max(40),
  isActive: z.boolean().optional().default(true)
});

export const productUpdateSchema = productSchema.partial();

export const createOrderSchema = z.object({
  productId: z.string().cuid(),
  buyerEmail: z.string().email(),
  buyerName: z.string().min(2).max(80).optional(),
  paymentMethod: z.enum(["CLICK", "PAYME", "STRIPE", "CRYPTO"])
});

export const paymentWebhookSchema = z.object({
  orderId: z.string().uuid(),
  paymentId: z.string().min(3).max(120),
  status: z.enum(["PAID", "FAILED"]).default("PAID")
});

const clickNumberish = z.union([z.string(), z.number()]).transform((value) => String(value));

export const clickWebhookSchema = z.object({
  click_trans_id: clickNumberish,
  service_id: clickNumberish,
  merchant_trans_id: z.string().uuid(),
  merchant_prepare_id: clickNumberish.optional(),
  amount: clickNumberish,
  action: z.union([z.literal("0"), z.literal("1"), z.literal(0), z.literal(1)]).transform((value) => String(value)),
  sign_time: z.string().min(1),
  sign_string: z.string().min(8),
  error: clickNumberish.optional().default("0"),
  error_note: z.string().optional(),
  click_paydoc_id: clickNumberish.optional()
});

export const paymeRpcSchema = z.object({
  jsonrpc: z.string().optional(),
  id: z.union([z.string(), z.number(), z.null()]),
  method: z.string().min(1),
  params: z.record(z.any()).optional()
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus)
});

export const deliverOrderSchema = z.object({
  force: z.boolean().optional().default(false)
});

export const bulkAccountsSchema = z.object({
  productId: z.string().cuid(),
  csv: z.string().min(5).max(1_000_000)
});
