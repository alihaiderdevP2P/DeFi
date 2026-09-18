import Link from "next/link";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-600 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100">
            Crowdfunding DApp
          </p>
          <p className="mt-1">
            Secure, transparent campaign funding on blockchain.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/">Campaigns</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/create">Create Campaign</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/support">Support</Link>
          <Link href="/api/docs">API Docs</Link>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          © {currentYear} Crowdfunding DApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
