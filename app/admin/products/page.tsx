import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import ProductManager from "@/components/admin/ProductManager";
import Sidebar from "@/components/layout/Sidebar";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Products Management</h1>
        <ProductManager initialProducts={products} />
      </div>
    </div>
  );
}
