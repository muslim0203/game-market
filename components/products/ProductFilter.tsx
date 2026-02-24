"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type Props = {
  categories: string[];
};

export default function ProductFilter({ categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentQ = searchParams.get("q") || "";

  function applyFilter({ q, category }: { q?: string; category?: string }) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    router.push(`${pathname}?${params.toString()}`);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const q = (form.querySelector('input[name="q"]') as HTMLInputElement)?.value?.trim() || "";
    const category = (form.querySelector('select[name="category"]') as HTMLSelectElement)?.value || "";
    applyFilter({ q: q || undefined, category: category || undefined });
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Kategoriya chip'lari — bir klikda filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-foreground">Kategoriya:</span>
        <button
          type="button"
          onClick={() => applyFilter({ q: currentQ || undefined })}
          className={cn(
            "rounded-xl border px-3 py-1.5 text-sm font-medium backdrop-blur-sm transition-all",
            !currentCategory
              ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "border-white/20 bg-white/10 text-foreground hover:bg-white/20"
          )}
        >
          Barchasi
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => applyFilter({ category: cat, q: currentQ || undefined })}
            className={cn(
              "rounded-xl border px-3 py-1.5 text-sm font-medium backdrop-blur-sm transition-all",
              currentCategory === cat
                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "border-white/20 bg-white/10 text-foreground hover:bg-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Qidiruv va dropdown */}
      <form
        key={`${currentQ}-${currentCategory}`}
        onSubmit={onSubmit}
        className="glass-card grid gap-3 p-4 md:grid-cols-[1fr_auto_auto]"
      >
        <Input
          name="q"
          defaultValue={currentQ}
          placeholder="Mahsulotlarni qidirish..."
        />
        <select
          name="category"
          defaultValue={currentCategory}
          className="flex h-9 w-full min-w-[140px] rounded-xl border border-white/20 bg-white/5 px-3 py-1 text-sm text-foreground backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Barcha kategoriyalar</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <Button type="submit">Qidirish</Button>
      </form>
    </div>
  );
}
