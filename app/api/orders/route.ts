import { Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { calculateCommission } from "@/lib/commission";
import { encryptValue } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import { orderSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = orderSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    include: { seller: true }
  });

  if (!listing || listing.status !== Status.ACTIVE) {
    return NextResponse.json({ error: "Listing is not available" }, { status: 404 });
  }

  if (listing.sellerId === session.user.id) {
    return NextResponse.json({ error: "You cannot buy your own listing" }, { status: 400 });
  }

  const amount = Number(listing.price);
  const commission = calculateCommission(amount, listing.seller.sellerTier);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        listingId: listing.id,
        buyerId: session.user.id,
        sellerId: listing.sellerId,
        amount,
        commission: commission.commission,
        payoutAmount: commission.payout,
        credentials: parsed.data.credentials ? encryptValue(parsed.data.credentials) : undefined,
        escrowReleaseAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    await tx.listing.update({
      where: { id: listing.id },
      data: { status: Status.SOLD }
    });

    return created;
  });

  return NextResponse.json({ data: order }, { status: 201 });
}
