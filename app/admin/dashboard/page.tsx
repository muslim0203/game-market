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
        <section className="glass-card p-6">
          <h1 className="mb-3 text-3xl font-semibold text-foreground">Dashboard</h1>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mahsulotlar</p>
              <p className="text-xl font-semibold text-foreground">{productsCount}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Buyurtmalar</p>
              <p className="text-xl font-semibold text-foreground">{ordersCount}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tushum</p>
              <p className="text-xl font-semibold text-foreground">{new Intl.NumberFormat("uz-UZ").format(paidRevenue._sum.amount || 0)} UZS</p>
            </div>
          </div>
        </section>

        <section className="glass-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Kam qolganlar</h2>
            <Badge tone="warning">{lowStock.length}</Badge>
          </div>
          <div className="space-y-2 text-sm">
            {lowStock.length ? (
              lowStock.map((product) => (
                <p key={product.id} className="rounded-xl border border-white/10 bg-white/5 p-2 text-muted-foreground backdrop-blur-sm">
                  {product.name} — {product.stock} ta
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">Kam qolgan mahsulot yo‘q.</p>
            )}
          </div>
        </section>

        <section className="glass-card p-5">
          <h2 className="mb-3 text-xl font-semibold text-foreground">So‘nggi buyurtmalar</h2>
          <div className="space-y-2 text-sm">
            {recentOrders.length ? (
              recentOrders.map((order) => (
                <p key={order.id} className="rounded-xl border border-white/10 bg-white/5 p-2 text-muted-foreground backdrop-blur-sm">
                  {order.product.name} — {order.buyerEmail} — {order.status}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">Buyurtmalar yo‘q.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
