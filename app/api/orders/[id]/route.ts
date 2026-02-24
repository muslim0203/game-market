import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { OrderStatus } from "@/lib/order-status";
import { decryptAccountCredentials } from "@/lib/orders";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      product: true,
      account: true
    }
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const credentials =
    order.status === OrderStatus.DELIVERED && order.account
      ? decryptAccountCredentials({
          login: order.account.login,
          password: order.account.password,
          extraInfo: order.account.extraInfo
        })
      : null;

  return NextResponse.json({
    data: {
      id: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
      product: {
        name: order.product.name,
        duration: order.product.duration,
        logo: order.product.logo
      },
      credentials
    }
  });
}
