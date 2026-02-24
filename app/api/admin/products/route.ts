import { NextResponse } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";
import { productSchema } from "@/lib/validations";

export async function GET() {
  const session = await assertAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ data: products });
}

export async function POST(request: Request) {
  const session = await assertAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = productSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;

  const exists = await prisma.product.findUnique({ where: { slug: payload.slug } });

  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      name: sanitizeText(payload.name),
      slug: payload.slug,
      description: sanitizeText(payload.description),
      logo: payload.logo,
      category: sanitizeText(payload.category),
      price: payload.price,
      currency: payload.currency.toUpperCase(),
      duration: sanitizeText(payload.duration),
      isActive: payload.isActive
    }
  });

  return NextResponse.json({ data: product }, { status: 201 });
}
