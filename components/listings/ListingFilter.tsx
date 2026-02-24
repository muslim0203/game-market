"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ListingFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }

    params.set("sort", sort);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="mb-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 md:grid-cols-[1fr_auto_auto]">
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or description" />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="h-11 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-sky-400 focus:outline-none"
      >
        <option value="newest">Newest</option>
        <option value="priceAsc">Price low to high</option>
        <option value="priceDesc">Price high to low</option>
      </select>
      <Button type="submit">Apply</Button>
    </form>
  );
}
