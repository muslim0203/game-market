import { notFound } from "next/navigation";

import BuyNowButton from "@/components/listings/BuyNowButton";
import Badge from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { toMoney } from "@/lib/utils";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ListingDetailPage({ params }: PageProps) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          isVerified: true,
          sellerRating: true,
          totalSales: true
        }
      }
    }
  });

  if (!listing) {
    notFound();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <section className="space-y-4">
        <div
          className="h-80 rounded-2xl border border-slate-800 bg-cover bg-center"
          style={{ backgroundImage: `url(${listing.images[0] || "https://images.unsplash.com/photo-1511512578047-dfb367046420"})` }}
        />

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <h1 className="mb-2 text-3xl font-semibold">{listing.title}</h1>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge tone="info">{listing.category}</Badge>
            <Badge>{listing.game}</Badge>
            <Badge>{listing.platform}</Badge>
          </div>
          <p className="whitespace-pre-line text-slate-300">{listing.description}</p>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm text-slate-400">Price</p>
          <p className="mb-4 text-3xl font-bold text-sky-300">{toMoney(listing.price.toString())}</p>
          <BuyNowButton listingId={listing.id} />
          <p className="mt-3 text-xs text-slate-400">Funds are held in escrow until delivery confirmation.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="mb-2 text-sm text-slate-400">Seller</p>
          <p className="text-lg font-semibold">@{listing.seller.username}</p>
          <p className="text-sm text-slate-300">
            {listing.seller.sellerRating.toFixed(1)}★ • {listing.seller.totalSales} sales
          </p>
          <p className="text-xs text-slate-400">{listing.seller.isVerified ? "Verified seller" : "Unverified seller"}</p>
        </div>
      </aside>
    </div>
  );
}
