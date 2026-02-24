import { Prisma } from "@prisma/client";

import ProductFilter from "@/components/products/ProductFilter";
import ProductGrid from "@/components/products/ProductGrid";
import { prisma } from "@/lib/db";

type PageProps = {
  searchParams: {
    q?: string;
    category?: string;
  };
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(searchParams.category ? { category: { equals: searchParams.category, mode: "insensitive" } } : {}),
    ...(searchParams.q
      ? {
          OR: [
            { name: { contains: searchParams.q, mode: "insensitive" } },
            { description: { contains: searchParams.q, mode: "insensitive" } }
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
      <h1 className="mb-2 text-3xl font-semibold">Products</h1>
      <p className="mb-6 text-sm text-slate-400">Premium subscription accounts with automated delivery.</p>
      <ProductFilter categories={categories.map((item) => item.category)} />
      <ProductGrid products={products} />
    </div>
  );
}
