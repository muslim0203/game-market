import { OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { orderStatusSchema } from "@/lib/validations";

type Params = {
  params: {
    id: string;
  };
};

export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { listing: true }
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const isBuyer = order.buyerId === session.user.id;
  const isSeller = order.sellerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isBuyer && !isSeller && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await request.json();
  const parsed = orderStatusSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const target = parsed.data.status;

  if (target === OrderStatus.COMPLETED && !isBuyer && !isAdmin) {
    return NextResponse.json({ error: "Only buyer can complete an order" }, { status: 403 });
  }

  if (target === OrderStatus.DELIVERED && !isSeller && !isAdmin) {
    return NextResponse.json({ error: "Only seller can mark as delivered" }, { status: 403 });
  }

  if (target === OrderStatus.REFUNDED && !isAdmin) {
    return NextResponse.json({ error: "Only admin can mark as refunded" }, { status: 403 });
  }

  if (
    order.status === OrderStatus.COMPLETED ||
    order.status === OrderStatus.REFUNDED ||
    order.status === OrderStatus.DISPUTED
  ) {
    return NextResponse.json({ error: "Order is closed and cannot be updated" }, { status: 400 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const record = await tx.order.update({
      where: { id: order.id },
      data: { status: target }
    });

    if (target === OrderStatus.COMPLETED) {
      await tx.user.update({
        where: { id: order.sellerId },
        data: {
          balance: { increment: order.payoutAmount },
          totalSales: { increment: 1 }
        }
      });
    }

    if (target === OrderStatus.REFUNDED) {
      await tx.listing.update({
        where: { id: order.listingId },
        data: { status: "ACTIVE" }
      });
    }

    return record;
  });

  return NextResponse.json({ data: updated });
}
