import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";
import { createOrderSchema } from "@/lib/validations";

function getRequesterIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const ip = getRequesterIp(request.headers);
  const rate = checkRateLimit({ key: `order-create:${ip}`, windowMs: 60_000, max: 5 });

  if (!rate.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await request.json();
  const parsed = createOrderSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId }
  });

  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Product not available" }, { status: 404 });
  }

  if (product.stock <= 0) {
    return NextResponse.json({ error: "Out of stock" }, { status: 409 });
  }

  const order = await prisma.order.create({
    data: {
      productId: product.id,
      buyerEmail: parsed.data.buyerEmail.toLowerCase(),
      buyerName: parsed.data.buyerName ? sanitizeText(parsed.data.buyerName) : null,
      amount: product.price,
      currency: product.currency,
      paymentMethod: parsed.data.paymentMethod
    },
    include: {
      product: true
    }
  });

  return NextResponse.json(
    {
      data: order,
      redirectTo: `/checkout/${order.id}`
    },
    { status: 201 }
  );
}
