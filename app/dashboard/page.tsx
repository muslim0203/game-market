import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import OrderCard from "@/components/orders/OrderCard";
import Badge from "@/components/ui/Badge";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const [user, latestOrders, activeListings] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.order.findMany({
      where: {
        OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }]
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { title: true, game: true } },
        seller: { select: { username: true } },
        buyer: { select: { username: true } }
      }
    }),
    prisma.listing.count({ where: { sellerId: session.user.id, status: "ACTIVE" } })
  ]);

  if (!user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar />

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-3xl font-semibold">Welcome, {user.username}</h1>
            <Badge tone={user.isVerified ? "success" : "warning"}>{user.isVerified ? "Verified" : "KYC Pending"}</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-xs uppercase text-slate-400">Balance</p>
              <p className="text-xl font-semibold text-emerald-300">${Number(user.balance).toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-xs uppercase text-slate-400">Active Listings</p>
              <p className="text-xl font-semibold text-sky-300">{activeListings}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-xs uppercase text-slate-400">Total Sales</p>
              <p className="text-xl font-semibold text-sky-300">{user.totalSales}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          {latestOrders.length ? (
            latestOrders.map((order) => <OrderCard key={order.id} order={order} asBuyer={order.buyerId === session.user.id} />)
          ) : (
            <p className="text-sm text-slate-400">No orders yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
