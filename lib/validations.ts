import { Category, OrderStatus } from "@prisma/client";
import { z } from "zod";

const imageUrlSchema = z.string().url().max(500);

export const registerSchema = z.object({
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const listingSchema = z.object({
  title: z.string().min(4).max(120),
  description: z.string().min(20).max(5000),
  price: z.number().positive().max(500000),
  category: z.nativeEnum(Category),
  game: z.string().min(2).max(80),
  platform: z.string().min(2).max(40),
  images: z.array(imageUrlSchema).min(1).max(8)
});

export const listingUpdateSchema = listingSchema.partial();

export const orderSchema = z.object({
  listingId: z.string().cuid(),
  credentials: z.string().min(2).max(5000).optional()
});

export const orderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus)
});

export const reviewSchema = z.object({
  orderId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000)
});

export const checkoutSchema = z.object({
  orderId: z.string().cuid()
});
