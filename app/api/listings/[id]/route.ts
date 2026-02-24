import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";
import { listingUpdateSchema } from "@/lib/validations";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          avatar: true,
          isVerified: true,
          sellerRating: true,
          totalSales: true,
          createdAt: true
        }
      }
    }
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ data: listing });
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.sellerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await request.json();
  const parsed = listingUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const updated = await prisma.listing.update({
    where: { id: params.id },
    data: {
      ...(data.title ? { title: sanitizeText(data.title) } : {}),
      ...(data.description ? { description: sanitizeText(data.description) } : {}),
      ...(typeof data.price === "number" ? { price: data.price } : {}),
      ...(data.category ? { category: data.category } : {}),
      ...(data.game ? { game: sanitizeText(data.game) } : {}),
      ...(data.platform ? { platform: sanitizeText(data.platform) } : {}),
      ...(data.images ? { images: data.images } : {})
    }
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.sellerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const suspended = await prisma.listing.update({
    where: { id: params.id },
    data: { status: "SUSPENDED" }
  });

  return NextResponse.json({ data: suspended });
}
