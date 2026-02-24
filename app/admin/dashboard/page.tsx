import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Badge from "@/components/ui/Badge";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const [productsCount, ordersCount, paidRevenue, lowStock, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "DELIVERED"] } },
      _sum: { amount: true }
    }),
    prisma.product.findMany({
      where: { stock: { lt: 3 }, isActive: true },
      orderBy: { stock: "asc" },
      take: 8
    }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { name: true }
        }
      }
    })
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar />

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h1 className="mb-3 text-3xl font-semibold">Admin Dashboard</h1>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-xs uppercase text-slate-400">Products</p>
              <p className="text-xl font-semibold text-cyan-300">{productsCount}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-xs uppercase text-slate-400">Orders</p>
              <p className="text-xl font-semibold text-cyan-300">{ordersCount}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-xs uppercase text-slate-400">Revenue</p>
              <p className="text-xl font-semibold text-emerald-300">{new Intl.NumberFormat("uz-UZ").format(paidRevenue._sum.amount || 0)} UZS</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
            <Badge tone="warning">{lowStock.length}</Badge>
          </div>
          <div className="space-y-2 text-sm">
            {lowStock.length ? (
              lowStock.map((product) => (
                <p key={product.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-slate-300">
                  {product.name} — {product.stock} left
                </p>
              ))
            ) : (
              <p className="text-slate-400">No low stock items.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-3 text-xl font-semibold">Recent Orders</h2>
          <div className="space-y-2 text-sm">
            {recentOrders.length ? (
              recentOrders.map((order) => (
                <p key={order.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-slate-300">
                  {order.product.name} — {order.buyerEmail} — {order.status}
                </p>
              ))
            ) : (
              <p className="text-slate-400">No orders yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
