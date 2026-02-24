"use client";

import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const methods = ["CLICK", "PAYME", "STRIPE", "CRYPTO"] as const;

type Props = {
  productId: string;
  stock: number;
};

export default function OrderCreateForm({ productId, stock }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<(typeof methods)[number]>("CLICK");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (stock <= 0) {
      setError("Out of stock");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId,
        buyerEmail: String(formData.get("buyerEmail") || ""),
        buyerName: String(formData.get("buyerName") || "") || undefined,
        paymentMethod: method
      })
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ? JSON.stringify(result.error) : "Order creation failed");
      setLoading(false);
      return;
    }

    window.location.href = `/checkout/${result.data.id}`;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <Input name="buyerEmail" type="email" placeholder="Email" required />
      <Input name="buyerName" placeholder="Name (optional)" />

      <select
        value={method}
        onChange={(event) => setMethod(event.target.value as (typeof methods)[number])}
        className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
      >
        {methods.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <Button className="w-full" disabled={loading || stock <= 0}>
        {loading ? "Creating order..." : stock <= 0 ? "Out of stock" : "Go to Checkout"}
      </Button>
    </form>
  );
}
