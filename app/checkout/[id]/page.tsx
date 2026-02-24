import { notFound } from "next/navigation";

import CheckoutPayPanel from "@/components/products/CheckoutPayPanel";
import { prisma } from "@/lib/db";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function CheckoutPage({ params }: PageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      product: true
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-3xl font-semibold">Checkout</h1>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <p className="text-sm text-slate-400">Order ID</p>
        <p className="break-all text-sm text-slate-200">{order.id}</p>
        <div className="mt-4 grid gap-2 text-sm text-slate-300">
          <p>Product: {order.product.name}</p>
          <p>Duration: {order.product.duration}</p>
          <p>Email: {order.buyerEmail}</p>
          <p>
            Amount: {new Intl.NumberFormat("uz-UZ").format(order.amount)} {order.currency}
          </p>
          <p>Status: {order.status}</p>
        </div>
      </div>

      <CheckoutPayPanel orderId={order.id} paymentMethod={order.paymentMethod} />
    </div>
  );
}
