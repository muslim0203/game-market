import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = checkoutSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { listing: true }
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const stripe = getStripeClient();

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(order.amount) * 100),
            product_data: {
              name: order.listing.title,
              description: `${order.listing.game} • ${order.listing.platform}`
            }
          }
        }
      ],
      metadata: {
        orderId: order.id,
        listingId: order.listingId,
        buyerId: order.buyerId
      },
      success_url: process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/orders",
      cancel_url: process.env.STRIPE_CANCEL_URL || "http://localhost:3000/listings"
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutId: checkout.id }
    });

    return NextResponse.json({
      checkoutUrl: checkout.url,
      checkoutId: checkout.id
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Stripe checkout failed"
      },
      { status: 500 }
    );
  }
}
