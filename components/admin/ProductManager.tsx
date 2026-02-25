"use client";

import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  category: string;
  price: number;
  originalPrice: number | null;
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

const textareaClass =
  "flex min-h-[6rem] w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm backdrop-blur-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function ProductManager({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");
    const rawOriginal = formData.get("originalPrice");
    const rawStock = formData.get("stock");

    const payload = {
      name,
      slug: makeSlug(name),
      description: String(formData.get("description") || ""),
      logo: String(formData.get("logo") || ""),
      category: String(formData.get("category") || "AI Tools"),
      price: Number(formData.get("price") || 0),
      originalPrice: rawOriginal ? Number(rawOriginal) : null,
      currency: String(formData.get("currency") || "UZS"),
      duration: String(formData.get("duration") || "1 oy"),
      stock: rawStock !== null && rawStock !== "" ? Number(rawStock) : 0,
      isActive: formData.get("isActive") === "on"
    };

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error ? JSON.stringify(result.error) : "Failed to create product");
      setLoading(false);
      return;
    }

    setProducts((prev) => [result.data, ...prev]);
    setMessage("Mahsulot qo‘shildi");
    event.currentTarget.reset();
    setLoading(false);
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingProduct) return;
    setEditLoading(true);

    const formData = new FormData(event.currentTarget);
    const rawOriginal = formData.get("originalPrice");

    const payload = {
      name: String(formData.get("name") || ""),
      slug: String(formData.get("slug") || ""),
      description: String(formData.get("description") || ""),
      logo: String(formData.get("logo") || ""),
      category: String(formData.get("category") || ""),
      price: Number(formData.get("price") || 0),
      originalPrice: rawOriginal !== null && rawOriginal !== "" ? Number(rawOriginal) : null,
      currency: String(formData.get("currency") || "UZS"),
      duration: String(formData.get("duration") || ""),
      stock: Number(formData.get("stock") ?? 0),
      isActive: formData.get("isActive") === "on"
    };

    const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      setEditLoading(false);
      return;
    }

    setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? result.data : p)));
    setEditingProduct(null);
    setEditLoading(false);
  }

  async function toggleProduct(product: Product) {
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive })
    });

    if (!response.ok) return;

    setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, isActive: !item.isActive } : item)));
  }

  async function removeProduct(productId: string) {
    const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    if (!response.ok) return;
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    setEditingProduct((p) => (p?.id === productId ? null : p));
  }

  return (
    <div className="space-y-5">
      <form onSubmit={createProduct} className="glass-card space-y-3 p-5">
        <h2 className="text-xl font-semibold text-foreground">Yangi mahsulot qo&apos;shish</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <Input name="name" placeholder="Nomi" required />
          <Input name="category" placeholder="Kategoriya" defaultValue="AI" required />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Input name="logo" placeholder="Logo URL" required />
          <Input name="duration" placeholder="Muddat" defaultValue="1 oy" required />
        </div>

        <textarea name="description" placeholder="Tavsif" required className={textareaClass} />

        <div className="grid gap-3 md:grid-cols-3">
          <Input name="price" type="number" min="1000" step="1000" placeholder="Narx" required />
          <Input name="originalPrice" type="number" min="0" step="1000" placeholder="Asl narx (ixtiyoriy)" />
          <Input name="currency" placeholder="Valyuta" defaultValue="UZS" required />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Input name="stock" type="number" min="0" placeholder="Qoldiq (ombordagi)" defaultValue="0" />
          <label className="flex h-9 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 text-sm text-foreground backdrop-blur-sm">
            <input type="checkbox" name="isActive" defaultChecked /> Faol
          </label>
        </div>

        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        <Button disabled={loading}>{loading ? "Saqlanmoqda..." : "Qo‘shish"}</Button>
      </form>

      <div className="glass-card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-white/15 bg-white/10 text-left text-muted-foreground backdrop-blur-sm">
            <tr>
              <th className="px-3 py-2 font-medium">Nomi</th>
              <th className="px-3 py-2 font-medium">Kategoriya</th>
              <th className="px-3 py-2 font-medium">Narx</th>
              <th className="px-3 py-2 font-medium">Qoldiq</th>
              <th className="px-3 py-2 font-medium">Holat</th>
              <th className="px-3 py-2 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-white/10">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.category}</td>
                <td className="px-3 py-2">
                  {new Intl.NumberFormat("uz-UZ").format(product.price)} {product.currency}
                </td>
                <td className="px-3 py-2">{product.stock}</td>
                <td className="px-3 py-2">{product.isActive ? "Faol" : "Nofaol"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                      Tahrirlash
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => toggleProduct(product)}>
                      {product.isActive ? "O‘chirish" : "Yoqish"}
                    </Button>
                    <Button type="button" variant="danger" size="sm" onClick={() => removeProduct(product.id)}>
                      O‘chirish
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="glass-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-semibold text-foreground">Mahsulotni tahrirlash</h2>
            <form onSubmit={saveEdit} className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <Input name="name" placeholder="Nomi" defaultValue={editingProduct.name} required />
                <Input name="slug" placeholder="Slug" defaultValue={editingProduct.slug} required />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input name="category" placeholder="Kategoriya" defaultValue={editingProduct.category} required />
                <Input name="duration" placeholder="Muddat" defaultValue={editingProduct.duration} required />
              </div>

              <Input name="logo" placeholder="Logo URL" defaultValue={editingProduct.logo} required />

              <textarea
                name="description"
                placeholder="Tavsif"
                defaultValue={editingProduct.description}
                required
                className={textareaClass}
              />

              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  name="price"
                  type="number"
                  min="1000"
                  step="1000"
                  placeholder="Narx"
                  defaultValue={editingProduct.price}
                  required
                />
                <Input
                  name="originalPrice"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="Asl narx (ixtiyoriy)"
                  defaultValue={editingProduct.originalPrice ?? ""}
                />
                <Input name="currency" placeholder="Valyuta" defaultValue={editingProduct.currency} required />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="Qoldiq"
                  defaultValue={editingProduct.stock}
                />
                <label className="flex h-9 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 text-sm text-foreground backdrop-blur-sm">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingProduct.isActive}
                  />
                  Faol
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                  Bekor qilish
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
