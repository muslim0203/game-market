import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/orders", label: "Orders" },
  { href: "/sell", label: "Create Listing" },
  { href: "/admin", label: "Admin" }
];

export default function Sidebar() {
  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">Control Panel</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg border border-transparent px-3 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/70 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
