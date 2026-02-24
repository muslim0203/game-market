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
  let stripe;
  try {
    stripe = getStripeClient();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Missing STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

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
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { listingId: true }
      });

      if (order) {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: {
              status: OrderStatus.PENDING,
              stripeCheckoutId: session.id,
              stripePaymentIntentId: paymentIntentId,
              escrowReleaseAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
          }),
          prisma.listing.update({
            where: { id: order.listingId },
            data: { status: "SOLD" }
          })
        ]);
      }
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    if (typeof charge.payment_intent === "string") {
      const checkout = await prisma.order.findFirst({
        where: {
          stripePaymentIntentId: charge.payment_intent
        },
        select: {
          id: true,
          listingId: true
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
