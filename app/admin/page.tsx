import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Badge from "@/components/ui/Badge";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [pendingDisputes, suspendedListings, unverifiedSellers] = await Promise.all([
    prisma.order.findMany({
      where: { status: "DISPUTED" },
      include: {
        listing: { select: { title: true } },
        buyer: { select: { username: true } },
        seller: { select: { username: true } }
      },
      take: 20,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.listing.findMany({
      where: { status: "SUSPENDED" },
      include: {
        seller: { select: { username: true } }
      },
      take: 20,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.user.findMany({
      where: {
        role: { in: ["SELLER", "BUYER"] },
        isVerified: false,
        listings: { some: {} }
      },
      take: 20,
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin Panel</h1>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Disputes</h2>
          <Badge tone="warning">{pendingDisputes.length}</Badge>
        </div>
        <div className="space-y-2 text-sm">
          {pendingDisputes.length ? (
            pendingDisputes.map((order) => (
              <p key={order.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-slate-300">
                {order.listing.title} — buyer @{order.buyer.username}, seller @{order.seller.username}
              </p>
            ))
          ) : (
            <p className="text-slate-400">No disputes.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Suspended Listings</h2>
          <Badge tone="info">{suspendedListings.length}</Badge>
        </div>
        <div className="space-y-2 text-sm">
          {suspendedListings.length ? (
            suspendedListings.map((listing) => (
              <p key={listing.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-slate-300">
                {listing.title} — @{listing.seller.username}
              </p>
            ))
          ) : (
            <p className="text-slate-400">No suspended listings.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Unverified Sellers</h2>
          <Badge>{unverifiedSellers.length}</Badge>
        </div>
        <div className="space-y-2 text-sm">
          {unverifiedSellers.length ? (
            unverifiedSellers.map((user) => (
              <p key={user.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-slate-300">
                @{user.username} ({user.email})
              </p>
            ))
          ) : (
            <p className="text-slate-400">No pending verification queue.</p>
          )}
        </div>
      </section>
    </div>
  );
}
