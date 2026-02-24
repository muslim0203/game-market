"use client";

import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  currency: string;
  duration: string;
  stock: number;
  isActive: boolean;
};

type Props = {
  initialProducts: Product[];
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductManager({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");

    const payload = {
      name,
      slug: makeSlug(name),
      description: String(formData.get("description") || ""),
      logo: String(formData.get("logo") || ""),
      category: String(formData.get("category") || "AI Tools"),
      price: Number(formData.get("price") || 0),
      currency: String(formData.get("currency") || "UZS"),
      duration: String(formData.get("duration") || "1 oy"),
      isActive: formData.get("isActive") === "on"
    };

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error ? JSON.stringify(result.error) : "Failed to create product");
      setLoading(false);
      return;
    }

    setProducts((prev) => [result.data, ...prev]);
    setMessage("Product created");
    event.currentTarget.reset();
    setLoading(false);
  }

  async function toggleProduct(product: Product) {
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive })
    });

    if (!response.ok) {
      return;
    }

    setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, isActive: !item.isActive } : item)));
  }

  async function removeProduct(productId: string) {
    const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });

    if (!response.ok) {
      return;
    }

    setProducts((prev) => prev.filter((item) => item.id !== productId));
  }

  return (
    <div className="space-y-5">
      <form onSubmit={createProduct} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-xl font-semibold">Add Product</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <Input name="name" placeholder="Product name" required />
          <Input name="category" placeholder="Category" defaultValue="AI Tools" required />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Input name="logo" placeholder="Logo URL" required />
          <Input name="duration" placeholder="Duration" defaultValue="1 oy" required />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          required
          className="h-24 w-full rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
        />

        <div className="grid gap-3 md:grid-cols-3">
          <Input name="price" type="number" min="1000" step="1000" placeholder="Price" required />
          <Input name="currency" placeholder="Currency" defaultValue="UZS" required />
          <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 text-sm text-slate-100">
            <input type="checkbox" name="isActive" defaultChecked /> Active
          </label>
        </div>

        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
        <Button disabled={loading}>{loading ? "Saving..." : "Create Product"}</Button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-left text-slate-400">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-slate-800/70">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.category}</td>
                <td className="px-3 py-2">
                  {new Intl.NumberFormat("uz-UZ").format(product.price)} {product.currency}
                </td>
                <td className="px-3 py-2">{product.stock}</td>
                <td className="px-3 py-2">{product.isActive ? "ACTIVE" : "INACTIVE"}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => toggleProduct(product)}>
                      Toggle
                    </Button>
                    <Button type="button" variant="danger" size="sm" onClick={() => removeProduct(product.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
