import Link from "next/link";

const items = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Mahsulotlar" },
  { href: "/admin/orders", label: "Buyurtmalar" },
  { href: "/admin/accounts", label: "Akkauntlar" }
];

export default function Sidebar() {
  return (
    <aside className="glass-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Menyu</h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
