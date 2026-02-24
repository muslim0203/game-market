import ProductCard from "@/components/products/ProductCard";

type ProductGridProps = {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    logo: string;
    category: string;
    price: number;
    originalPrice?: number | null;
    currency: string;
    duration: string;
    stock: number;
  }>;
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="glass-card rounded-2xl border-dashed border-white/20 p-10 text-center text-muted-foreground">
        Mahsulot topilmadi.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
