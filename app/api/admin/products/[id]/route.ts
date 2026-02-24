import { NextResponse } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";
import { productUpdateSchema } from "@/lib/validations";

type Params = {
  params: {
    id: string;
  };
};

export async function PUT(request: Request, { params }: Params) {
  const session = await assertAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = productUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...(payload.name ? { name: sanitizeText(payload.name) } : {}),
      ...(payload.slug ? { slug: payload.slug } : {}),
      ...(payload.description ? { description: sanitizeText(payload.description) } : {}),
      ...(payload.logo ? { logo: payload.logo } : {}),
      ...(payload.category ? { category: sanitizeText(payload.category) } : {}),
      ...(typeof payload.price === "number" ? { price: payload.price } : {}),
      ...(payload.originalPrice !== undefined ? { originalPrice: payload.originalPrice } : {}),
      ...(payload.currency ? { currency: payload.currency.toUpperCase() } : {}),
      ...(payload.duration ? { duration: sanitizeText(payload.duration) } : {}),
      ...(typeof payload.stock === "number" ? { stock: payload.stock } : {}),
      ...(typeof payload.isActive === "boolean" ? { isActive: payload.isActive } : {})
    }
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await assertAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ data: deleted });
  } catch {
    return NextResponse.json({ error: "Product has related orders and cannot be deleted" }, { status: 409 });
  }
}
