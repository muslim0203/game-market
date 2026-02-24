import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PENDING,
          stripeCheckoutId: session.id,
          escrowReleaseAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    if (charge.payment_intent) {
      const checkout = await prisma.order.findFirst({
        where: {
          stripeCheckoutId: {
            not: null
          }
        },
        select: {
          id: true,
          listingId: true,
          stripeCheckoutId: true
        }
      });

      if (checkout) {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: checkout.id },
            data: { status: OrderStatus.REFUNDED }
          }),
          prisma.listing.update({
            where: { id: checkout.listingId },
            data: { status: "ACTIVE" }
          })
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}
