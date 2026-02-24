"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

type OrderItem = {
  id: string;
  status: string;
  buyerEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string | null;
  createdAt: string;
  product: {
    name: string;
    duration: string;
  };
};

type Props = {
  initialOrders: OrderItem[];
};

const statuses = ["PENDING", "PAID", "DELIVERED", "FAILED", "REFUNDED"];

export default function OrdersManager({ initialOrders }: Props) {
  const [orders, setOrders] = useState(initialOrders);

  async function updateStatus(orderId: string, status: string) {
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      return;
    }

    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
  }

  async function deliver(orderId: string) {
    const response = await fetch(`/api/admin/orders/${orderId}/deliver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ force: true })
    });

    if (!response.ok) {
      return;
    }

    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "DELIVERED" } : order)));
  }

  return (
    <div className="glass-card overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-white/15 bg-white/10 text-left text-muted-foreground backdrop-blur-sm">
          <tr>
            <th className="px-3 py-2 font-medium">Buyurtma</th>
            <th className="px-3 py-2 font-medium">Mahsulot</th>
            <th className="px-3 py-2 font-medium">Buyer</th>
            <th className="px-3 py-2 font-medium">Summa</th>
            <th className="px-3 py-2 font-medium">Holat</th>
            <th className="px-3 py-2 font-medium">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-white/10 align-top">
              <td className="px-3 py-2 text-xs text-muted-foreground">{order.id}</td>
              <td className="px-3 py-2">
                {order.product.name}
                <p className="text-xs text-muted-foreground">{order.product.duration}</p>
              </td>
              <td className="px-3 py-2">{order.buyerEmail}</td>
              <td className="px-3 py-2">
                {new Intl.NumberFormat("uz-UZ").format(order.amount)} {order.currency}
              </td>
              <td className="px-3 py-2">{order.status}</td>
              <td className="px-3 py-2">
                <div className="flex flex-col gap-2">
                  <select
                    className="flex h-9 rounded-xl border border-white/20 bg-white/5 px-2 text-xs backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={order.status}
                    onChange={(event) => updateStatus(order.id, event.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <Button type="button" size="sm" onClick={() => deliver(order.id)}>
                    Deliver
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
