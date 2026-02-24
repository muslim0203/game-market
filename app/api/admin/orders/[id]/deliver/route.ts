import { NextResponse } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { assignAccountAndDeliver } from "@/lib/orders";
import { deliverOrderSchema } from "@/lib/validations";

type Params = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: Params) {
  const session = await assertAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => ({}));
  const parsed = deliverOrderSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    if (parsed.data.force) {
      await prisma.order.update({
        where: { id: params.id },
        data: { status: "PAID" }
      });
    }

    const delivered = await assignAccountAndDeliver(params.id);

    return NextResponse.json({
      data: {
        orderId: delivered.order.id,
        status: delivered.order.status,
        deliveredAt: delivered.order.deliveredAt
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Delivery failed" }, { status: 400 });
  }
}
