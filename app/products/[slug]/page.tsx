import { notFound } from "next/navigation";

import OrderCreateForm from "@/components/products/OrderCreateForm";
import Badge from "@/components/ui/Badge";
import { prisma } from "@/lib/db";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug }
  });

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center gap-4">
            <img src={product.logo} alt={product.name} className="h-16 w-16 rounded-2xl object-cover" />
            <div>
              <h1 className="text-3xl font-semibold">{product.name}</h1>
              <p className="text-sm text-slate-400">{product.duration}</p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <Badge tone="info">{product.category}</Badge>
            {product.stock > 0 ? <Badge tone="success">In stock: {product.stock}</Badge> : <Badge tone="warning">Out of stock</Badge>}
          </div>

          <p className="whitespace-pre-line text-slate-300">{product.description}</p>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm text-slate-400">Price</p>
          <p className="mb-4 text-3xl font-bold text-cyan-300">
            {new Intl.NumberFormat("uz-UZ").format(product.price)} {product.currency}
          </p>
          <OrderCreateForm productId={product.id} stock={product.stock} />
          <p className="mt-3 text-xs text-slate-400">Order is delivered automatically after payment confirmation.</p>
        </div>
      </aside>
    </div>
  );
}
