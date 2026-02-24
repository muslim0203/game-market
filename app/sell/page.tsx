import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import ListingForm from "@/components/listings/ListingForm";
import { authOptions } from "@/lib/auth";

export default async function SellPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/sell");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl font-semibold">Create Listing</h1>
      <p className="text-sm text-slate-400">
        List only items/accounts that are allowed by game publisher terms. Prohibited listings may be suspended.
      </p>
      <ListingForm />
    </div>
  );
}
