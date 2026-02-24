import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { assertAdminSession } from "@/lib/admin-guard";
import { OrderStatus } from "@/lib/order-status";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const session = await assertAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const rawStatus = url.searchParams.get("status");
  const status =
    rawStatus && Object.values(OrderStatus).includes(rawStatus as (typeof OrderStatus)[keyof typeof OrderStatus])
      ? rawStatus
      : undefined;

  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {})
  };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          name: true,
          duration: true
        }
      }
    }
  });

  return NextResponse.json({ data: orders });
}
