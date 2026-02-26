import Link from "next/link";

import ProductGrid from "@/components/products/ProductGrid";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

/** Muhim mahsulotlar tartibi: Gemini Ultra → Canva Pro → CapCut → ChatGPT → Adobe */
const FEATURED_SLUG_ORDER = [
  "gemini-ultra",
  "canva-pro",
  "capcut-pro",
  "chatgpt-plus",
  "adobe-creative-cloud"
];

const featuredNames = [
  "Gemini Ultra",
  "Canva Pro",
  "CapCut Pro",
  "ChatGPT Plus",
  "Adobe Creative Cloud"
];

function sortFeaturedByOrder<T extends { slug: string }>(products: T[]): T[] {
  const result: T[] = [];
  const remaining = [...products];
  for (const prefix of FEATURED_SLUG_ORDER) {
    const idx = remaining.findIndex((p) => p.slug.startsWith(prefix));
    if (idx !== -1) {
      result.push(remaining[idx]);
      remaining.splice(idx, 1);
    }
  }
  return [...result, ...remaining];
}

export default async function HomePage() {
  const [allActive, productsCount, ordersCount, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ stock: "desc" }, { createdAt: "desc" }]
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"]
    })
  ]);

  const featured = sortFeaturedByOrder(allActive).slice(0, 8);
  const categoryList = categories.map((item) => item.category);
  const displayOrdersCount = Math.max(ordersCount, 78);

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd(), webSiteJsonLd()])
        }}
      />

      <section className="glass-card relative overflow-hidden bg-hero-grid p-8 md:p-12">
        <div className="max-w-3xl space-y-5 animate-fade-in">
          <Badge variant="info">Premium obuna do&apos;koni</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            ObunaPro — Premium Obuna Akkauntlari Do&apos;koni
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            ChatGPT Plus, Gemini, Claude, Canva, Adobe va boshqa xizmatlar. Har bir buyurtma to&apos;lovdan keyin avtomatik akkaunt bilan yetkaziladi.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products">
              <Button size="lg">Mahsulotlar</Button>
            </Link>
            <Link href="/order">
              <Button size="lg" variant="outline">
                Buyurtmani tekshirish
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="glass-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mahsulotlar</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{productsCount}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Buyurtmalar</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{displayOrdersCount}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Yetkazish</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">Avtomatik</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Xavfsizlik</p>
          <p className="mt-1 text-2xl font-bold text-foreground">Shifrlangan</p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Kategoriyalar</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:text-primary/90"
          >
            Barchasi
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categoryList.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="glass-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glass"
            >
              <p className="font-semibold text-foreground">{category}</p>
              <p className="mt-0.5 text-sm text-foreground/80">{category} bo&apos;yicha xizmatlar</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Muhim mahsulotlar</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:text-primary/90"
          >
            Barchasi
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
                logo: "/links/logo.png",
                category: index < 2 ? "AI" : index < 3 ? "Dizayn" : "Video",
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
