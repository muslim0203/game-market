import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || undefined;
  const q = url.searchParams.get("q") || undefined;
  const featured = url.searchParams.get("featured") === "true";

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(category ? { category: { equals: category } } : {}),
    ...(q
      ? {
          OR: [{ name: { contains: q } }, { description: { contains: q } }]
        }
      : {})
  };

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    ...(featured ? { take: 8 } : {})
  });

  return NextResponse.json({ data: products });
}
