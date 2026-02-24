import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

type Params = {
  params: {
    slug: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      _count: {
        select: {
          orders: true
        }
      }
    }
  });

  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ data: product });
}
