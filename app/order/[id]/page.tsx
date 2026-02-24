import Link from "next/link";
import { notFound } from "next/navigation";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { decryptAccountCredentials } from "@/lib/orders";

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
      <h1 className="text-3xl font-semibold">Order Status</h1>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-slate-400">Order #{order.id}</p>
          <Badge tone={order.status === "DELIVERED" ? "success" : order.status === "FAILED" ? "warning" : "info"}>{order.status}</Badge>
        </div>

        <div className="grid gap-2 text-sm text-slate-300">
          <p>Product: {order.product.name}</p>
          <p>Amount: {new Intl.NumberFormat("uz-UZ").format(order.amount)} {order.currency}</p>
          <p>Payment method: {order.paymentMethod || "-"}</p>
          <p>Buyer email: {order.buyerEmail}</p>
          <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {credentials ? (
        <div className="rounded-2xl border border-emerald-700/50 bg-emerald-950/20 p-5">
          <h2 className="mb-3 text-xl font-semibold text-emerald-200">Delivered Credentials</h2>
          <div className="grid gap-2 text-sm text-slate-200">
            <p>Login: {credentials.login}</p>
            <p>Password: {credentials.password}</p>
            <p>Extra info: {credentials.extraInfo || "-"}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
          Credentials will appear here after payment confirmation and automatic delivery.
        </div>
      )}

      <Link href="/products">
        <Button variant="ghost">Back to products</Button>
      </Link>
    </div>
  );
}
