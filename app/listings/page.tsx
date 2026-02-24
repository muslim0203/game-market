import { Category, Prisma, Status } from "@prisma/client";

import ListingFilter from "@/components/listings/ListingFilter";
import ListingGrid from "@/components/listings/ListingGrid";
import { prisma } from "@/lib/db";

type PageProps = {
  searchParams: {
    q?: string;
    sort?: string;
    category?: string;
    game?: string;
    platform?: string;
  };
};

export default async function ListingsPage({ searchParams }: PageProps) {
  const category =
    searchParams.category && Object.values(Category).includes(searchParams.category as Category)
      ? (searchParams.category as Category)
      : undefined;

  const where: Prisma.ListingWhereInput = {
    status: Status.ACTIVE,
    ...(category ? { category } : {}),
    ...(searchParams.game ? { game: { contains: searchParams.game, mode: "insensitive" as const } } : {}),
    ...(searchParams.platform ? { platform: { contains: searchParams.platform, mode: "insensitive" as const } } : {}),
    ...(searchParams.q
      ? {
          OR: [
            { title: { contains: searchParams.q, mode: "insensitive" as const } },
            { description: { contains: searchParams.q, mode: "insensitive" as const } }
          ]
        }
      : {})
  };

  const orderBy =
    searchParams.sort === "priceAsc"
      ? { price: "asc" as const }
      : searchParams.sort === "priceDesc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const listings = await prisma.listing.findMany({
    where,
    orderBy,
    include: {
      seller: {
        select: {
          username: true,
          isVerified: true,
          sellerRating: true
        }
      }
    }
  });

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold">Listings</h1>
      <p className="mb-6 text-sm text-slate-400">Find verified sellers and ToS-compliant offers.</p>
      <ListingFilter />
      <ListingGrid listings={listings} />
    </div>
  );
}
