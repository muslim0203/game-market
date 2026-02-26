import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { decryptAccountCredentials } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Buyurtma holati",
  robots: { index: false, follow: false }
};

type PageProps = {
  params: {
    id: string;
  };
};

export default async function OrderPage({ params }: PageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      product: true,
      account: true
    }
  });

  if (!order) {
    notFound();
  }

  const credentials = order.status === "DELIVERED" && order.account ? decryptAccountCredentials(order.account) : null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-3xl font-semibold text-foreground">Buyurtma holati</h1>

      <div className="glass-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Buyurtma #{order.id}</p>
          <Badge tone={order.status === "DELIVERED" ? "success" : order.status === "FAILED" ? "warning" : "info"}>{order.status}</Badge>
        </div>

        <div className="grid gap-2 text-sm text-muted-foreground">
          <p>Mahsulot: {order.product.name}</p>
          <p>Summa: {new Intl.NumberFormat("uz-UZ").format(order.amount)} {order.currency}</p>
          <p>To‘lov: {order.paymentMethod || "-"}</p>
          <p>Email: {order.buyerEmail}</p>
          <p>Sana: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {credentials ? (
        <div className="glass-card border-emerald-200/50 bg-emerald-50/80 p-5 dark:border-emerald-500/20 dark:bg-emerald-950/40">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Yetkazilgan ma’lumotlar</h2>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <p>Login: {credentials.login}</p>
            <p>Parol: {credentials.password}</p>
            <p>Qo‘shimcha: {credentials.extraInfo || "-"}</p>
          </div>
        </div>
      ) : (
        <div className="glass-card p-5 text-sm text-muted-foreground">
          To‘lov tasdiqlangach akkaunt ma’lumotlari shu yerga avtomatik chiqadi.
        </div>
      )}

      <Link href="/products">
        <Button variant="outline">Mahsulotlarga qaytish</Button>
      </Link>
    </div>
  );
}
