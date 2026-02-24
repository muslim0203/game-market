"use client";

import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";

type Product = {
  id: string;
  name: string;
  stock: number;
};

type Props = {
  products: Product[];
};

const sampleCsv = `login,password,extra_info\nuser@gmail.com,Pass123!,backup_code:XXXX`;

export default function AccountsBulkUpload({ products }: Props) {
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [csv, setCsv] = useState(sampleCsv);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submitBulk(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/accounts/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId,
        csv
      })
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error ? JSON.stringify(result.error) : "Upload failed");
      setLoading(false);
      return;
    }

    setMessage(`Inserted ${result.data.inserted} accounts`);
    setLoading(false);
  }

  return (
    <form onSubmit={submitBulk} className="glass-card space-y-3 p-5">
      <h2 className="text-xl font-semibold text-foreground">Akkauntlarni yuklash (CSV)</h2>

      <select
        value={productId}
        onChange={(event) => setProductId(event.target.value)}
        className="flex h-9 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-1 text-sm backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {products.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} (qoldiq: {item.stock})
          </option>
        ))}
      </select>

      <textarea
        value={csv}
        onChange={(event) => setCsv(event.target.value)}
        className="flex min-h-[14rem] w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm backdrop-blur-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button disabled={loading}>{loading ? "Yuklanmoqda..." : "CSV yuklash"}</Button>
    </form>
  );
}
