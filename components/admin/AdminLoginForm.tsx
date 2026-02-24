"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AdminLoginForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const response = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false
    });

    if (!response || response.error) {
      setError("Invalid admin credentials");
      setLoading(false);
      return;
    }

    window.location.href = response.url || callbackUrl;
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h1 className="mb-1 text-2xl font-semibold">Admin Login</h1>
      <p className="mb-5 text-sm text-slate-400">Authorized staff only</p>

      <form onSubmit={onSubmit} className="space-y-3">
        <Input name="email" type="email" placeholder="Admin email" required />
        <Input name="password" type="password" placeholder="Password" required />
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <Button className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
