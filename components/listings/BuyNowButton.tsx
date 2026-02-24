"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

export default function BuyNowButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId })
      });

      const orderJson = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderJson.error || "Order creation failed");
      }

      const paymentRes = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderJson.data.id })
      });

      const paymentJson = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentJson.error || "Checkout failed");
      }

      if (paymentJson.checkoutUrl) {
        window.location.href = paymentJson.checkoutUrl;
        return;
      }

      throw new Error("Checkout URL missing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setLoading(false);
      return;
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleBuy} disabled={loading} className="w-full">
        {loading ? "Processing..." : "Buy with Escrow"}
      </Button>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
