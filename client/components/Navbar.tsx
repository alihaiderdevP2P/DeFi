"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { WalletButton } from "./WalletButton";

export function Navbar() {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Campaigns" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/create", label: "Create" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Crowdfunding DApp
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "rounded-md bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                    : "rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
