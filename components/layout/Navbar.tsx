"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

import Button from "@/components/ui/Button";

const SITE_LOGO = "/links/logo.png";

export default function Navbar() {
  const { data } = useSession();
  const isAdmin = data?.user?.role === "ADMIN";

  return (
    <header className="glass sticky top-0 z-50 w-full rounded-none border-x-0 border-t-0">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <Image
            src={SITE_LOGO}
            alt="ObunaPro"
            width={200}
            height={56}
            className="h-12 w-auto max-h-14 object-contain object-left sm:h-14"
            priority
            unoptimized
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const next = e.currentTarget.nextElementSibling as HTMLElement;
              if (next) next.classList.remove("hidden");
            }}
          />
          <span className="hidden text-lg font-semibold text-foreground">ObunaPro</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Mahsulotlar
          </Link>
          <Link
            href="/order"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Buyurtmani tekshirish
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Biz haqimizda
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Aloqa
          </Link>
          {isAdmin ? (
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium text-primary hover:text-primary/90"
            >
              Admin
            </Link>
          ) : (
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Kirish
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              Chiqish
            </Button>
          ) : (
            <Link href="/products">
              <Button size="sm">Sotuvga o‘tish</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
