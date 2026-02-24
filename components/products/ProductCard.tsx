import Link from "next/link";

import Badge from "@/components/ui/Badge";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    logo: string;
    category: string;
    price: number;
    currency: string;
    duration: string;
    stock: number;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 transition hover:-translate-y-1 hover:border-cyan-400/50"
    >
      <div className="flex h-40 items-center justify-center bg-slate-900/70 p-6">
        <img src={product.logo} alt={product.name} className="h-20 w-20 rounded-2xl object-cover" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-100">{product.name}</h3>
          <span className="text-sm font-bold text-cyan-300">
            {new Intl.NumberFormat("uz-UZ").format(product.price)} {product.currency}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone="info">{product.category}</Badge>
          <Badge>{product.duration}</Badge>
          {product.stock > 0 ? <Badge tone="success">In stock: {product.stock}</Badge> : <Badge tone="warning">Out of stock</Badge>}
        </div>
      </div>
    </Link>
  );
}
