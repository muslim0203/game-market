"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Props = {
  categories: string[];
};

export default function ProductFilter({ categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="mb-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 md:grid-cols-[1fr_auto_auto]">
      <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search subscriptions" />
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        className="h-11 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
      >
        <option value="">All categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <Button type="submit">Apply</Button>
    </form>
  );
}
