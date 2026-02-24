"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import Button from "@/components/ui/Button";

export default function Navbar() {
  const { data } = useSession();
  const isAdmin = data?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#050914]/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-3xl tracking-wide text-slate-100">
          DigitalHub
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/products" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Products
          </Link>
          <Link href="/order" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Order Lookup
          </Link>
          {isAdmin ? (
            <Link href="/admin/dashboard" className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">
              Admin Panel
            </Link>
          ) : (
            <Link href="/admin" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              Admin Logout
            </Button>
          ) : (
            <Link href="/products">
              <Button size="sm">Shop Now</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
