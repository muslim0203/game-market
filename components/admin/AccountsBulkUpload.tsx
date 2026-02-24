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
    <form onSubmit={submitBulk} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="text-xl font-semibold">Bulk Account Upload</h2>

      <select
        value={productId}
        onChange={(event) => setProductId(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
      >
        {products.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} (stock: {item.stock})
          </option>
        ))}
      </select>

      <textarea
        value={csv}
        onChange={(event) => setCsv(event.target.value)}
        className="h-56 w-full rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
      />

      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      <Button disabled={loading}>{loading ? "Uploading..." : "Upload CSV"}</Button>
    </form>
  );
}
