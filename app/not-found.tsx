import Link from "next/link";

import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-slate-300">The page you requested does not exist.</p>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
