"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

type Props = {
  orderId: string;
  paymentMethod: string | null;
};

function randomPaymentId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function CheckoutPayPanel({ orderId, paymentMethod }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function simulatePayment() {
    setLoading(true);
    setError(null);

    const normalized = paymentMethod || "CLICK";
    const endpoint = normalized === "PAYME" ? "/api/payments/payme" : "/api/payments/click";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderId,
        paymentId: randomPaymentId(normalized.toLowerCase()),
        status: "PAID"
      })
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ? JSON.stringify(result.error) : "Payment failed");
      setLoading(false);
      return;
    }

    window.location.href = `/order/${orderId}`;
  }

  return (
    <div className="glass-card p-5">
      <h2 className="mb-2 text-xl font-semibold text-foreground">To‘lovni yakunlash</h2>
      <p className="mb-4 text-sm text-muted-foreground">To‘lov usuli: {paymentMethod || "CLICK"}</p>
      {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
      <Button className="w-full" onClick={simulatePayment} disabled={loading}>
        {loading ? "Processing..." : "Simulate Successful Payment"}
      </Button>
    </div>
  );
}
