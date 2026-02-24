import { notFound } from "next/navigation";

import ListingGrid from "@/components/listings/ListingGrid";
import Badge from "@/components/ui/Badge";
import { prisma } from "@/lib/db";

type PageProps = {
  params: {
    username: string;
  };
};

export default async function ProfilePage({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      listings: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        include: {
          seller: {
            select: {
              username: true,
              isVerified: true,
              sellerRating: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">@{user.username}</h1>
          {user.isVerified ? <Badge tone="success">Verified Seller</Badge> : <Badge>Unverified</Badge>}
        </div>
        <p className="mt-2 text-sm text-slate-300">Rating: {user.sellerRating.toFixed(1)}★</p>
        <p className="text-sm text-slate-300">Total sales: {user.totalSales}</p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Active Listings</h2>
        <ListingGrid listings={user.listings} />
      </section>
    </div>
  );
}
