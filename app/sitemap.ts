import type { MetadataRoute } from "next";

import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true }
    });

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: "https://obunapro.uz",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0
        },
        {
            url: "https://obunapro.uz/products",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9
        },
        {
            url: "https://obunapro.uz/about",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5
        },
        {
            url: "https://obunapro.uz/contact",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5
        }
    ];

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
        url: `https://obunapro.uz/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8
    }));

    return [...staticPages, ...productPages];
}
