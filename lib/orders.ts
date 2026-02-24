import { OrderStatus } from "@prisma/client";

import { decryptValue } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import { sendOrderDeliveredMail, sendOrderFailedMail } from "@/lib/email";

export type DecryptedAccount = {
  login: string;
  password: string;
  extraInfo: string | null;
};

export function decryptAccountCredentials(args: { login: string; password: string; extraInfo: string | null }): DecryptedAccount {
  return {
    login: decryptValue(args.login),
    password: decryptValue(args.password),
    extraInfo: args.extraInfo ? decryptValue(args.extraInfo) : null
  };
}

export async function assignAccountAndDeliver(orderId: string) {
  const data = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        product: true
      }
    });

    if (!order) {
      throw new Error("ORDER_NOT_FOUND");
    }

    if (order.status === OrderStatus.DELIVERED && order.accountId) {
      const account = await tx.account.findUnique({ where: { id: order.accountId } });

      if (!account) {
        throw new Error("ACCOUNT_NOT_FOUND");
      }

      return { order, account, product: order.product };
    }

    if (order.status !== OrderStatus.PAID) {
      throw new Error("ORDER_NOT_PAID");
    }

    const account = await tx.account.findFirst({
      where: {
        productId: order.productId,
        isSold: false
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    if (!account) {
      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.FAILED }
      });
      throw new Error("OUT_OF_STOCK");
    }

    const now = new Date();

    await tx.account.update({
      where: { id: account.id },
      data: {
        isSold: true,
        soldAt: now,
        orderId: order.id
      }
    });

    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        accountId: account.id,
        status: OrderStatus.DELIVERED,
        deliveredAt: now
      }
    });

    await tx.product.update({
      where: { id: order.productId },
      data: {
        stock: {
          decrement: 1
        }
      }
    });

    return { order: updatedOrder, account, product: order.product };
  });

  const decrypted = decryptAccountCredentials(data.account);

  await sendOrderDeliveredMail({
    to: data.order.buyerEmail,
    orderId: data.order.id,
    productName: data.product.name,
    login: decrypted.login,
    password: decrypted.password,
    extraInfo: decrypted.extraInfo
  });

  return {
    ...data,
    decrypted
  };
}

export async function markOrderFailed(orderId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.FAILED }
  });

  await sendOrderFailedMail({
    to: order.buyerEmail,
    orderId: order.id
  });

  return order;
}
