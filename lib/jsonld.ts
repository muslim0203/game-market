export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ObunaPro",
        url: "https://obunapro.uz",
        logo: "https://obunapro.uz/links/logo.png",
        description:
            "Premium obuna akkauntlari va litsenziyalarni xavfsiz va tez yetkazib beruvchi platforma.",
        contactPoint: {
            "@type": "ContactPoint",
            email: "support@obunapro.uz",
            contactType: "customer service",
            availableLanguage: "uz"
        },
        address: {
            "@type": "PostalAddress",
            addressLocality: "Toshkent",
            addressCountry: "UZ"
        }
    };
}

export function productJsonLd(product: {
    name: string;
    description: string | null;
    price: number;
    currency: string;
    logo: string;
    slug: string;
    stock: number;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.logo,
        url: `https://obunapro.uz/products/${product.slug}`,
        brand: {
            "@type": "Brand",
            name: "ObunaPro"
        },
        offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: product.currency,
            availability:
                product.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            seller: {
                "@type": "Organization",
                name: "ObunaPro"
            }
        }
    };
}

export function webSiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ObunaPro",
        url: "https://obunapro.uz",
        description:
            "Premium obuna akkauntlari — ChatGPT Plus, Canva Pro, Adobe va boshqalar.",
        publisher: {
            "@type": "Organization",
            name: "ObunaPro"
        }
    };
}
