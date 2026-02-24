import { NextResponse } from "next/server";

import { handlePaymentWebhook } from "@/lib/payment";
import { paymentWebhookSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = paymentWebhookSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await handlePaymentWebhook({
      orderId: parsed.data.orderId,
      paymentId: parsed.data.paymentId,
      status: parsed.data.status,
      paymentMethod: "CLICK"
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment handling failed" }, { status: 400 });
  }
}
