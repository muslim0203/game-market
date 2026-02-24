import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { handlePaymentWebhook } from "@/lib/payment";
import { assertIpWhitelist, verifyPaymeBasicAuth } from "@/lib/webhook-security";
import { paymentWebhookSchema, paymeRpcSchema } from "@/lib/validations";

export const runtime = "nodejs";

type RpcId = string | number | null;

function rpcResult(id: RpcId, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result });
}

function rpcError(id: RpcId, code: number, message: string, data?: unknown, status = 200) {
  return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message, data } }, { status });
}

function getOrderIdFromAccount(params: Record<string, unknown>) {
  const account = params.account;

  if (!account || typeof account !== "object") {
    return null;
  }

  const fieldName = process.env.PAYME_ACCOUNT_FIELD || "orderId";
  const value = (account as Record<string, unknown>)[fieldName];

  return typeof value === "string" ? value : null;
}

function asString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  let payload: unknown;

  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsedRpc = paymeRpcSchema.safeParse(payload);

  if (parsedRpc.success) {
    const rpc = parsedRpc.data;
    const paymeLogin = process.env.PAYME_MERCHANT_LOGIN;
    const paymeKey = process.env.PAYME_SECRET_KEY;

    if (!paymeLogin || !paymeKey) {
      if (process.env.NODE_ENV === "production") {
        return rpcError(rpc.id, -32504, "PAYME_CONFIG_MISSING", null, 500);
      }
    } else {
      const ipRule = assertIpWhitelist(request.headers, process.env.PAYME_ALLOWED_IPS);

      if (!ipRule.allowed) {
        return rpcError(rpc.id, -32504, "IP_NOT_ALLOWED");
      }

      const auth = verifyPaymeBasicAuth({
        headers: request.headers,
        expectedLogin: paymeLogin,
        expectedKey: paymeKey
      });

      if (!auth.ok) {
        return rpcError(rpc.id, -32504, "AUTH_FAILED", auth.reason);
      }
    }

    const method = rpc.method;
    const params = rpc.params || {};

    if (method === "CheckPerformTransaction") {
      const orderId = getOrderIdFromAccount(params);
      const amount = typeof params.amount === "number" ? params.amount : null;

      if (!orderId || amount === null) {
        return rpcError(rpc.id, -32602, "Invalid params");
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { product: true }
      });

      if (!order) {
        return rpcError(rpc.id, -31050, "Order not found");
      }

      const expectedAmount = Math.round(order.amount * 100);

      if (amount !== expectedAmount) {
        return rpcError(rpc.id, -31001, "Amount mismatch");
      }

      if (order.product.stock <= 0 && !order.accountId) {
        return rpcError(rpc.id, -31008, "Out of stock");
      }

      return rpcResult(rpc.id, { allow: true });
    }

    if (method === "CreateTransaction") {
      const orderId = getOrderIdFromAccount(params);
      const transactionId = asString(params.id);

      if (!orderId || !transactionId) {
        return rpcError(rpc.id, -32602, "Invalid params");
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        return rpcError(rpc.id, -31050, "Order not found");
      }

      if (order.paymentId && order.paymentId !== transactionId) {
        return rpcError(rpc.id, -31099, "Transaction conflict");
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentId: transactionId,
          paymentMethod: "PAYME"
        }
      });

      return rpcResult(rpc.id, {
        create_time: Date.now(),
        transaction: transactionId,
        state: 1
      });
    }

    if (method === "PerformTransaction") {
      const transactionId = asString(params.id);
      const orderIdFromAccount = getOrderIdFromAccount(params);

      if (!transactionId && !orderIdFromAccount) {
        return rpcError(rpc.id, -32602, "Invalid params");
      }

      const order = await prisma.order.findFirst({
        where: transactionId
          ? {
              OR: [{ paymentId: transactionId }, ...(orderIdFromAccount ? [{ id: orderIdFromAccount }] : [])]
            }
          : { id: orderIdFromAccount || "" }
      });

      if (!order) {
        return rpcError(rpc.id, -31003, "Transaction not found");
      }

      await handlePaymentWebhook({
        orderId: order.id,
        paymentId: transactionId || order.paymentId || `payme_${Date.now()}`,
        status: "PAID",
        paymentMethod: "PAYME"
      });

      return rpcResult(rpc.id, {
        transaction: transactionId || order.paymentId || order.id,
        perform_time: Date.now(),
        state: 2
      });
    }

    if (method === "CancelTransaction") {
      const transactionId = asString(params.id);

      if (!transactionId) {
        return rpcError(rpc.id, -32602, "Invalid params");
      }

      const order = await prisma.order.findFirst({
        where: { paymentId: transactionId }
      });

      if (!order) {
        return rpcError(rpc.id, -31003, "Transaction not found");
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { status: "REFUNDED" }
      });

      return rpcResult(rpc.id, {
        transaction: transactionId,
        cancel_time: Date.now(),
        state: -1
      });
    }

    if (method === "CheckTransaction") {
      const transactionId = asString(params.id);

      if (!transactionId) {
        return rpcError(rpc.id, -32602, "Invalid params");
      }

      const order = await prisma.order.findFirst({
        where: { paymentId: transactionId }
      });

      if (!order) {
        return rpcError(rpc.id, -31003, "Transaction not found");
      }

      const state = order.status === "DELIVERED" ? 2 : order.status === "FAILED" ? -1 : order.status === "REFUNDED" ? -2 : 1;

      return rpcResult(rpc.id, {
        transaction: transactionId,
        state,
        create_time: new Date(order.createdAt).getTime(),
        perform_time: order.deliveredAt ? new Date(order.deliveredAt).getTime() : 0,
        cancel_time: 0
      });
    }

    return rpcError(rpc.id, -32601, "Method not found");
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "INVALID_PAYME_FORMAT" }, { status: 400 });
  }

  const parsedFallback = paymentWebhookSchema.safeParse(payload);

  if (!parsedFallback.success) {
    return NextResponse.json({ error: parsedFallback.error.flatten() }, { status: 400 });
  }

  try {
    const result = await handlePaymentWebhook({
      orderId: parsedFallback.data.orderId,
      paymentId: parsedFallback.data.paymentId,
      status: parsedFallback.data.status,
      paymentMethod: "PAYME"
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment handling failed" }, { status: 400 });
  }
}
