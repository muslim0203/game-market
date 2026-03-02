"use client";

import Link from "next/link";
import Image from "next/image";

import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: {
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
  };
  index?: number;
};

function formatPrice(value: number, currency: string) {
  const formattedValue = value.toLocaleString("en-US").replace(/,/g, " ");
  return currency === "UZS" ? `${formattedValue} so'm` : `${formattedValue} ${currency}`;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasDiscount = product.originalPrice != null && product.originalPrice > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      itemScope
      itemType="https://schema.org/Product"
      className={cn(
        "glass-card group relative flex flex-col overflow-hidden text-card-foreground",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-glass hover:border-white/30",
        "animate-card-in opacity-0"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <meta itemProp="name" content={product.name} />
      <div className="flex h-36 items-center justify-center border-b border-white/10 bg-white/5 p-6">
        <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-inner">
          <Image
            src={product.logo}
            alt={product.name}
            fill
            className="object-cover transition duration-200 group-hover:scale-105"
            sizes="80px"
            unoptimized
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove("hidden");
            }}
          />
          <span
            className="absolute inset-0 hidden flex items-center justify-center bg-muted text-2xl font-bold text-muted-foreground"
            aria-hidden
          >
            {product.name.charAt(0)}
          </span>
        </div>
        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground shadow">
            Aksiya
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        <p className="mb-3 text-xs text-muted-foreground line-clamp-2" itemProp="description">
          {product.name} qulay narxlarda. Premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat.
        </p>

        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap items-baseline gap-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content="UZS" />
            <meta itemProp="price" content={product.price.toString()} />
            <meta itemProp="availability" content={product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />

            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice!, product.currency)}
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="info">{product.category}</Badge>
            <Badge variant="secondary">{product.duration}</Badge>
            {product.stock > 0 ? (
              <Badge variant="success">Qolgan: {product.stock}</Badge>
            ) : (
              <Badge variant="warning">Tugadi</Badge>
            )}
          </div>

          <div className="mt-2 w-full pt-1">
            <span className="inline-block w-full rounded-md bg-primary/10 py-1.5 text-center text-sm font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              Buyurtma berish
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
