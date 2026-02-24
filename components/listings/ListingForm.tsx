"use client";

import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const categories = ["ACCOUNT", "CURRENCY", "ITEM", "BOOSTING", "SERVICE"];

export default function ListingForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      price: Number(formData.get("price") || 0),
      category: String(formData.get("category") || "ACCOUNT"),
      game: String(formData.get("game") || ""),
      platform: String(formData.get("platform") || ""),
      images: String(formData.get("images") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      tosCompliant: true
    };

    if (formData.get("tosConfirm") !== "on") {
      setMessage("You must confirm that the listing is ToS-compliant.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error ? JSON.stringify(result.error) : "Failed to create listing");
      setLoading(false);
      return;
    }

    setMessage("Listing created successfully.");
    event.currentTarget.reset();
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="title" placeholder="Title" required />
        <Input name="price" type="number" min="1" step="0.01" placeholder="Price" required />
      </div>

      <textarea
        name="description"
        placeholder="Description"
        required
        className="h-32 w-full rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none"
      />

      <div className="grid gap-3 md:grid-cols-3">
        <select
          name="category"
          className="h-11 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-sky-400 focus:outline-none"
          defaultValue="ACCOUNT"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <Input name="game" placeholder="Game" required />
        <Input name="platform" placeholder="Platform" required />
      </div>

      <Input name="images" placeholder="Image URLs (comma separated)" required />
      <label className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-300">
        <input type="checkbox" name="tosConfirm" className="mt-0.5" />
        I confirm this listing follows the game publisher Terms of Service and platform policy.
      </label>

      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Publish Listing"}
      </Button>
    </form>
  );
}
