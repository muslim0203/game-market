"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import Button from "@/components/ui/Button";

const navItems = [
  { href: "/listings", label: "Listings" },
  { href: "/sell", label: "Sell" },
  { href: "/orders", label: "Orders" },
  { href: "/dashboard", label: "Dashboard" }
];

export default function Navbar() {
  const { data } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#050914]/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-3xl tracking-wide text-slate-100">
          GameMarket
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-300 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {data?.user ? (
            <>
              <Link href={`/profile/${data.user.name || "profile"}`} className="text-sm text-slate-300">
                {data.user.name}
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
