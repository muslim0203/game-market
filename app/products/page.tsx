import { Prisma } from "@prisma/client";
import type { Metadata } from "next";

import ProductFilter from "@/components/products/ProductFilter";
import ProductGrid from "@/components/products/ProductGrid";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Mahsulotlar",
  description:
    "Premium obuna akkauntlari — ChatGPT Plus, Canva Pro, Adobe Creative Cloud va boshqalar. Arzon narxda, to'lovdan keyin avtomatik yetkazib berish.",
  alternates: {
    canonical: "https://obunapro.uz/products"
  }
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: {
    q?: string;
    category?: string;
  };
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(searchParams.category ? { category: { equals: searchParams.category } } : {}),
    ...(searchParams.q
      ? {
        OR: [
          { name: { contains: searchParams.q } },
          { description: { contains: searchParams.q } }
        ]
      }
      : {})
  };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ stock: "desc" }, { createdAt: "desc" }]
    }),
    prisma.product.findMany({
      where: { isActive: true },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" }
    })
  ]);

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold text-foreground">Mahsulotlar</h1>
      <p className="mb-6 text-sm text-muted-foreground">Premium obuna akkauntlari, to‘lovdan keyin avtomatik yetkazib berish.</p>
      <ProductFilter categories={categories.map((item) => item.category)} />
      <ProductGrid products={products} />
    </div>
  );
}
