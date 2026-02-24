import ListingCard from "@/components/listings/ListingCard";

type ListingGridProps = {
  listings: Array<{
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
  }>;
};

export default function ListingGrid({ listings }: ListingGridProps) {
  if (!listings.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-slate-300">
        No listings found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
