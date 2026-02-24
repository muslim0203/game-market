import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import OrderCard from "@/components/orders/OrderCard";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }]
    },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { select: { title: true, game: true } },
      seller: { select: { username: true } },
      buyer: { select: { username: true } }
    }
  });

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Orders</h1>
      {orders.length ? (
        <>
          <OrderTimeline status={orders[0].status} />
          <div className="grid gap-3 lg:grid-cols-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} asBuyer={order.buyerId === session.user.id} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-400">No orders yet.</p>
      )}
    </div>
  );
}
