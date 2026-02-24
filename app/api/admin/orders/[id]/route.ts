import { NextResponse } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { updateOrderStatusSchema } from "@/lib/validations";

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
  const parsed = updateOrderStatusSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      status: parsed.data.status,
      ...(parsed.data.status === "DELIVERED" ? { deliveredAt: new Date() } : {})
    }
  });

  return NextResponse.json({ data: order });
}
