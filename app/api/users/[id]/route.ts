import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      username: true,
      avatar: true,
      role: true,
      isVerified: true,
      sellerRating: true,
      totalSales: true,
      createdAt: true,
      listings: {
        where: { status: "ACTIVE" },
        take: 12,
        orderBy: { createdAt: "desc" }
      },
      _count: {
        select: {
          listings: true,
          receivedReviews: true
        }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ data: user });
}
