import { Category, Prisma, Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";
import { listingSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(Number(url.searchParams.get("page") || "1") || 1, 1);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || "20") || 20, 1), 100);
  const rawCategory = url.searchParams.get("category");
  const category =
    rawCategory && Object.values(Category).includes(rawCategory as Category)
      ? (rawCategory as Category)
      : undefined;
  const game = url.searchParams.get("game") || undefined;
  const platform = url.searchParams.get("platform") || undefined;
  const q = url.searchParams.get("q") || undefined;
  const sort = url.searchParams.get("sort") || "newest";

  const where: Prisma.ListingWhereInput = {
    status: Status.ACTIVE,
    ...(category ? { category } : {}),
    ...(game ? { game: { contains: game, mode: "insensitive" as const } } : {}),
    ...(platform ? { platform: { contains: platform, mode: "insensitive" as const } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } }
          ]
        }
      : {})
  };

  const orderBy =
    sort === "priceAsc"
      ? { price: "asc" as const }
      : sort === "priceDesc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isVerified: true,
            sellerRating: true,
            totalSales: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.listing.count({ where })
  ]);

  return NextResponse.json({
    data: listings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = listingSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;

  const listing = await prisma.listing.create({
    data: {
      title: sanitizeText(payload.title),
      description: sanitizeText(payload.description),
      price: payload.price,
      category: payload.category,
      game: sanitizeText(payload.game),
      platform: sanitizeText(payload.platform),
      images: payload.images,
      sellerId: session.user.id
    },
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          isVerified: true,
          sellerRating: true
        }
      }
    }
  });

  return NextResponse.json({ data: listing }, { status: 201 });
}
