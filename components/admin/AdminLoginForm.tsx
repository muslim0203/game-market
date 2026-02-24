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
    <div className="glass-card mx-auto w-full max-w-md p-6">
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Admin kirish</h1>
      <p className="mb-5 text-sm text-muted-foreground">Faqat avtorizatsiyalangan xodimlar</p>

      <form onSubmit={onSubmit} className="space-y-3">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Parol" required />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button className="w-full" disabled={loading}>
          {loading ? "Kirilmoqda..." : "Kirish"}
        </Button>
      </form>
    </div>
  );
}
