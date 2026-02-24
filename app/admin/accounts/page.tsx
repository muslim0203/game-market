import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import AccountsBulkUpload from "@/components/admin/AccountsBulkUpload";
import Sidebar from "@/components/layout/Sidebar";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminAccountsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      stock: true
    }
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Account Pool</h1>
        {products.length ? <AccountsBulkUpload products={products} /> : <p className="text-muted-foreground">Avval mahsulotlar yarating.</p>}
      </div>
    </div>
  );
}
