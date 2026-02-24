import Link from "next/link";

import ProductGrid from "@/components/products/ProductGrid";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/db";

const featuredNames = [
  "ChatGPT Plus",
  "Claude Pro",
  "Gemini Pro",
  "Gemini Ultra",
  "Canva Pro",
  "Adobe Creative Cloud",
  "CapCut Pro",
  "Midjourney"
];

export default async function HomePage() {
  const [featured, productsCount, ordersCount, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ stock: "desc" }, { createdAt: "desc" }],
      take: 8
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"]
    })
  ]);

  const categoryList = categories.map((item) => item.category);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-hero-grid p-8 md:p-12">
        <div className="max-w-3xl space-y-5 animate-fade-in">
          <Badge tone="info">Admin-only digital goods store</Badge>
          <h1 className="font-display text-5xl leading-none tracking-wide text-slate-100 md:text-7xl">Premium Subscriptions, Instant Delivery</h1>
          <p className="max-w-2xl text-base text-slate-300 md:text-lg">
            ChatGPT Plus, Gemini, Claude, Canva, Adobe va boshqa premium xizmatlar. Har bir buyurtma to&apos;lovdan keyin avtomatik akkaunt bilan yetkaziladi.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
            <Link href="/order">
              <Button size="lg" variant="secondary">
                Track Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-400">Active Products</p>
          <p className="text-2xl font-bold text-cyan-300">{productsCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-400">Total Orders</p>
          <p className="text-2xl font-bold text-cyan-300">{ordersCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-400">Delivery</p>
          <p className="text-2xl font-bold text-emerald-300">Auto</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-400">Security</p>
          <p className="text-2xl font-bold text-fuchsia-300">AES-256</p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <Link href="/products" className="text-sm text-cyan-300">
            View all
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categoryList.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-cyan-500/50"
            >
              <p className="text-lg font-semibold">{category}</p>
              <p className="text-sm text-slate-400">Top services in {category}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Products</h2>
          <Link href="/products" className="text-sm text-cyan-300">
            See all
          </Link>
        </div>
        <ProductGrid
          products={
            featured.length
              ? featured
              : featuredNames.map((name, index) => ({
                  id: `sample-${index}`,
                  name,
                  slug: "products",
                  logo: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4",
                  category: index < 4 ? "AI Tools" : "Design",
                  price: 100000,
                  currency: "UZS",
                  duration: "1 oy",
                  stock: 0
                }))
          }
        />
      </section>
    </div>
  );
}
