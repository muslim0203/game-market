import Link from "next/link";

import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="glass-card mx-auto flex max-w-xl flex-col items-center gap-4 p-10 text-center">
      <h1 className="text-4xl font-semibold text-foreground">404</h1>
      <p className="text-muted-foreground">Bunday sahifa mavjud emas.</p>
      <Link href="/">
        <Button>Bosh sahifaga</Button>
      </Link>
    </div>
  );
}
