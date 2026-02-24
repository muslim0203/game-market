import { OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";
import { reviewSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = reviewSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: {
      review: true
    }
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Only buyer can review" }, { status: 403 });
  }

  if (order.status !== OrderStatus.COMPLETED) {
    return NextResponse.json({ error: "Only completed orders can be reviewed" }, { status: 400 });
  }

  if (order.review) {
    return NextResponse.json({ error: "Review already exists" }, { status: 409 });
  }

  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: {
        orderId: order.id,
        reviewerId: session.user.id,
        sellerId: order.sellerId,
        rating: parsed.data.rating,
        comment: sanitizeText(parsed.data.comment)
      }
    });

    const aggregate = await tx.review.aggregate({
      where: { sellerId: order.sellerId },
      _avg: { rating: true }
    });

    await tx.user.update({
      where: { id: order.sellerId },
      data: {
        sellerRating: Number((aggregate._avg.rating || 0).toFixed(2))
      }
    });

    return created;
  });

  return NextResponse.json({ data: review }, { status: 201 });
}
