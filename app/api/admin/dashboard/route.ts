import { NextResponse } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await assertAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [productsCount, ordersCount, pendingOrders, deliveredOrders, totalRevenue, lowStockProducts, latestOrders, topProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "DELIVERED"] } },
        _sum: { amount: true }
      }),
      prisma.product.findMany({
        where: { stock: { lt: 3 }, isActive: true },
        orderBy: { stock: "asc" },
        take: 10
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          product: { select: { name: true } }
        }
      }),
      prisma.order.groupBy({
        by: ["productId"],
        _count: { productId: true },
        orderBy: { _count: { productId: "desc" } },
        take: 5
      })
    ]);

  const topProductIds = topProducts.map((item) => item.productId);
  const topProductDetails = topProductIds.length
    ? await prisma.product.findMany({
        where: { id: { in: topProductIds } },
        select: { id: true, name: true }
      })
    : [];

  const topSales = topProducts.map((item) => ({
    productId: item.productId,
    sold: item._count.productId,
    productName: topProductDetails.find((detail) => detail.id === item.productId)?.name || "Unknown"
  }));

  return NextResponse.json({
    data: {
      productsCount,
      ordersCount,
      pendingOrders,
      deliveredOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
      lowStockProducts,
      latestOrders,
      topSales
    }
  });
}
