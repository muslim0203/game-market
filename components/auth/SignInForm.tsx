"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignInForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCredentials(event: FormEvent<HTMLFormElement>) {
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
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    window.location.href = response.url || callbackUrl;
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h1 className="mb-1 text-2xl font-semibold">Sign in</h1>
      <p className="mb-5 text-sm text-slate-400">Use credentials or OAuth providers</p>

      <form onSubmit={onCredentials} className="space-y-3">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <Button className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Continue"}
        </Button>
      </form>

      <div className="mt-4 space-y-2">
        <Button className="w-full" variant="ghost" onClick={() => signIn("google", { callbackUrl })}>
          Continue with Google
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => signIn("discord", { callbackUrl })}>
          Continue with Discord
        </Button>
      </div>
    </div>
  );
}
