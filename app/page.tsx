import Link from "next/link";

import ListingGrid from "@/components/listings/ListingGrid";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/db";

const categories = [
  { title: "Accounts", value: "ACCOUNT", description: "ToS-compliant accounts only" },
  { title: "Currency", value: "CURRENCY", description: "Fast delivery from rated sellers" },
  { title: "Items", value: "ITEM", description: "Secure item transfers via escrow" },
  { title: "Services", value: "SERVICE", description: "Boosting and in-game services" }
];

export default async function HomePage() {
  const [featured, userCount, listingCount, orderCount] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      take: 8,
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
    }),
    prisma.user.count(),
    prisma.listing.count(),
    prisma.order.count()
  ]);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-hero-grid p-8 md:p-12">
        <div className="max-w-3xl space-y-5 animate-fade-in">
          <Badge tone="warning">Escrow-enabled marketplace</Badge>
          <h1 className="font-display text-5xl leading-none tracking-wide text-slate-100 md:text-7xl">Trade Game Assets Safely</h1>
          <p className="max-w-2xl text-base text-slate-300 md:text-lg">
            Buy and sell game accounts, currency and items with escrow protection, seller reputation and strict moderation.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/listings">
              <Button size="lg">Browse Listings</Button>
            </Link>
            <Link href="/sell">
              <Button size="lg" variant="secondary">
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-400">Users</p>
          <p className="text-2xl font-bold text-sky-300">{userCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-400">Listings</p>
          <p className="text-2xl font-bold text-sky-300">{listingCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-400">Orders</p>
          <p className="text-2xl font-bold text-sky-300">{orderCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-400">Escrow</p>
          <p className="text-2xl font-bold text-emerald-300">24h hold</p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <Link href="/listings" className="text-sm text-sky-300">
            View all
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`/listings?category=${category.value}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-sky-500/50"
            >
              <p className="text-lg font-semibold">{category.title}</p>
              <p className="text-sm text-slate-400">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Listings</h2>
          <Link href="/listings" className="text-sm text-sky-300">
            See all
          </Link>
        </div>
        <ListingGrid listings={featured} />
      </section>
    </div>
  );
}
