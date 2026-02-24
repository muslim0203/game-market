export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#050914]/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-slate-400 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} GameMarket. Secure trade layer for game assets.</p>
        <p>Only ToS-compliant listings are allowed.</p>
      </div>
    </footer>
  );
}
