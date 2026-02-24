import Link from "next/link";

import Badge from "@/components/ui/Badge";
import { toMoney } from "@/lib/utils";

type ListingCardProps = {
  listing: {
    id: string;
    title: string;
    price: number | string;
    category: string;
    game: string;
    platform: string;
    images: string[];
    seller: {
      username: string;
      isVerified: boolean;
      sellerRating: number;
    };
  };
};

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group animate-rise-up overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 transition hover:-translate-y-1 hover:border-sky-400/50"
    >
      <div
        className="h-44 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${listing.images[0] || "https://images.unsplash.com/photo-1542751371-adc38448a05e"})` }}
      />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-100">{listing.title}</h3>
          <span className="text-sm font-bold text-sky-300">{toMoney(listing.price)}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone="info">{listing.category}</Badge>
          <Badge>{listing.game}</Badge>
          <Badge>{listing.platform}</Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>@{listing.seller.username}</span>
          <span>
            {listing.seller.sellerRating.toFixed(1)}★ {listing.seller.isVerified ? "• Verified" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
