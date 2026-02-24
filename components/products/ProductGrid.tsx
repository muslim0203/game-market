import ProductCard from "@/components/products/ProductCard";

type ProductGridProps = {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    logo: string;
    category: string;
    price: number;
    currency: string;
    duration: string;
    stock: number;
  }>;
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-slate-300">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
