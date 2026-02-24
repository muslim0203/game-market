import { OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { sendOrderPaidMail } from "@/lib/email";
import { assignAccountAndDeliver, markOrderFailed } from "@/lib/orders";

export async function handlePaymentWebhook(args: {
  orderId: string;
  paymentId: string;
  paymentMethod: "CLICK" | "PAYME";
  status: "PAID" | "FAILED";
}) {
  const order = await prisma.order.findUnique({
    where: { id: args.orderId },
    include: {
      product: true
    }
  });

  if (!order) {
    throw new Error("ORDER_NOT_FOUND");
  }

  if (args.status === "FAILED") {
    const failed = await markOrderFailed(order.id);
    return { order: failed, delivered: false };
  }

  if (order.status === OrderStatus.DELIVERED) {
    return { order, delivered: true };
  }

  if (order.status === OrderStatus.REFUNDED) {
    throw new Error("ORDER_REFUNDED");
  }

  const paidOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: OrderStatus.PAID,
      paymentId: args.paymentId,
      paymentMethod: args.paymentMethod
    }
  });

  await sendOrderPaidMail({
    to: paidOrder.buyerEmail,
    orderId: paidOrder.id,
    productName: order.product.name
  });

  await assignAccountAndDeliver(order.id);

  return { order: paidOrder, delivered: true };
}
