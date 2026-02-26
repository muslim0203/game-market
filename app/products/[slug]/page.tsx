import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import OrderCreateForm from "@/components/products/OrderCreateForm";
import Badge from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { productJsonLd } from "@/lib/jsonld";

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug }
  });

  if (!product) {
    return { title: "Mahsulot topilmadi" };
  }

  const description = `${product.name} — ${product.duration} obuna. Narxi: ${new Intl.NumberFormat("uz-UZ").format(product.price)} ${product.currency}. To'lovdan keyin avtomatik yetkazib berish.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | ObunaPro`,
      description: product.description?.slice(0, 160) || description,
      images: product.logo ? [{ url: product.logo, width: 400, height: 400, alt: product.name }] : [],
      type: "website"
    },
    twitter: {
      card: "summary",
      title: `${product.name} | ObunaPro`,
      description: description.slice(0, 140)
    },
    alternates: {
      canonical: `https://obunapro.uz/products/${params.slug}`
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug }
  });

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product))
        }}
      />
      <section className="space-y-4">
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center gap-4">
            <Image
              src={product.logo}
              alt={product.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-lg border border-border object-cover"
              unoptimized
            />
            <div>
              <h1 className="text-3xl font-semibold text-foreground">{product.name}</h1>
              <p className="text-sm text-foreground/80">{product.duration}</p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <Badge tone="info">{product.category}</Badge>
            {product.stock > 0 ? <Badge tone="success">Omborda: {product.stock}</Badge> : <Badge tone="warning">Tugadi</Badge>}
          </div>

          <p className="whitespace-pre-line text-foreground/90 leading-relaxed">{product.description}</p>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="glass-card p-5">
          <p className="text-sm font-medium text-foreground">Narx</p>
          {product.originalPrice != null && product.originalPrice > product.price && (
            <p className="mb-1 text-sm text-foreground/70 line-through">
              Asl narx: {new Intl.NumberFormat("uz-UZ").format(product.originalPrice)} {product.currency}
            </p>
          )}
          <p className="mb-4 text-3xl font-bold text-primary">
            {new Intl.NumberFormat("uz-UZ").format(product.price)} {product.currency}
          </p>
          <OrderCreateForm
            productId={product.id}
            productName={product.name}
            productPrice={product.price}
            productCurrency={product.currency}
            productDuration={product.duration}
            stock={product.stock}
          />
          <p className="mt-3 text-sm text-foreground/80">Telegram orqali buyurtma bering — operator tezda javob beradi.</p>
        </div>
      </aside>
    </div>
  );
}

