"use client";

import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function OrderLookupForm() {
  const [orderId, setOrderId] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (!orderId.trim()) {
      return;
    }

    window.location.href = `/order/${orderId.trim()}`;
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <Input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Paste your order ID" required />
      <Button className="w-full">Track Order</Button>
    </form>
  );
}
