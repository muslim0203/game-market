import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import OrdersManager from "@/components/admin/OrdersManager";
import Sidebar from "@/components/layout/Sidebar";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          name: true,
          duration: true
        }
      }
    }
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Orders Management</h1>
        <OrdersManager
          initialOrders={orders.map((order) => ({
            ...order,
            createdAt: order.createdAt.toISOString()
          }))}
        />
      </div>
    </div>
  );
}
