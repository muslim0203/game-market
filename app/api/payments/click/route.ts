import { NextResponse } from "next/server";

import { handlePaymentWebhook } from "@/lib/payment";
import { assertIpWhitelist, verifyClickSignature } from "@/lib/webhook-security";
import { clickWebhookSchema, paymentWebhookSchema } from "@/lib/validations";

export const runtime = "nodejs";

type ClickResponseBody = {
  click_trans_id?: string;
  merchant_trans_id?: string;
  merchant_prepare_id?: string;
  merchant_confirm_id?: string;
  error: number;
  error_note: string;
};

function clickResponse(body: ClickResponseBody, status = 200) {
  return NextResponse.json(body, { status });
}

function asNumber(value: string | number | null | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const contentType = request.headers.get("content-type") || "";

  let payload: unknown;

  try {
    if (contentType.includes("application/x-www-form-urlencoded")) {
      payload = Object.fromEntries(new URLSearchParams(rawBody).entries());
    } else {
      payload = rawBody ? JSON.parse(rawBody) : {};
    }
  } catch {
    return clickResponse({ error: -8, error_note: "INVALID_PAYLOAD" }, 400);
  }

  const parsedClick = clickWebhookSchema.safeParse(payload);

  if (parsedClick.success) {
    const clickData = parsedClick.data;
    const base = {
      click_trans_id: clickData.click_trans_id,
      merchant_trans_id: clickData.merchant_trans_id
    };

    const ipRule = assertIpWhitelist(request.headers, process.env.CLICK_ALLOWED_IPS);

    if (!ipRule.allowed) {
      return clickResponse({ ...base, error: -9, error_note: "IP_NOT_ALLOWED" }, 401);
    }

    const secret = process.env.CLICK_SECRET_KEY;

    if (!secret) {
      if (process.env.NODE_ENV === "production") {
        return clickResponse({ ...base, error: -9, error_note: "CLICK_SECRET_KEY_MISSING" }, 500);
      }
    } else {
      const verification = verifyClickSignature({
        payload: {
          click_trans_id: clickData.click_trans_id,
          service_id: clickData.service_id,
          merchant_trans_id: clickData.merchant_trans_id,
          merchant_prepare_id: clickData.merchant_prepare_id || undefined,
          amount: clickData.amount,
          action: clickData.action,
          sign_time: clickData.sign_time,
          sign_string: clickData.sign_string
        },
        secretKey: secret,
        serviceId: process.env.CLICK_SERVICE_ID || undefined,
        maxSkewSeconds: Number(process.env.CLICK_MAX_SKEW_SECONDS || 300)
      });

      if (!verification.ok) {
        return clickResponse({ ...base, error: -1, error_note: verification.reason }, 401);
      }
    }

    const action = clickData.action;
    const orderId = clickData.merchant_trans_id;
    const amount = asNumber(clickData.amount, -1);

    if (amount <= 0) {
      return clickResponse({ ...base, error: -2, error_note: "INVALID_AMOUNT" }, 400);
    }

    try {
      if (action === "0") {
        return clickResponse({
          ...base,
          merchant_prepare_id: clickData.merchant_prepare_id || orderId,
          error: 0,
          error_note: "Success"
        });
      }

      const status = clickData.error === "0" ? "PAID" : "FAILED";
      const paymentId = clickData.click_paydoc_id || clickData.click_trans_id;

      await handlePaymentWebhook({
        orderId,
        paymentId,
        status,
        paymentMethod: "CLICK"
      });

      return clickResponse({
        ...base,
        merchant_confirm_id: orderId,
        error: 0,
        error_note: "Success"
      });
    } catch (error) {
      return clickResponse(
        {
          ...base,
          error: -5,
          error_note: error instanceof Error ? error.message : "PAYMENT_PROCESSING_FAILED"
        },
        400
      );
    }
  }

  if (process.env.NODE_ENV === "production") {
    return clickResponse({ error: -8, error_note: "INVALID_CLICK_FORMAT" }, 400);
  }

  const parsedFallback = paymentWebhookSchema.safeParse(payload);

  if (!parsedFallback.success) {
    return clickResponse({ error: -8, error_note: "INVALID_PAYLOAD" }, 400);
  }

  try {
    const result = await handlePaymentWebhook({
      orderId: parsedFallback.data.orderId,
      paymentId: parsedFallback.data.paymentId,
      status: parsedFallback.data.status,
      paymentMethod: "CLICK"
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment handling failed" }, { status: 400 });
  }
}
