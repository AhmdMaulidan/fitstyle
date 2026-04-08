"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, LogOut, Package, Scissors } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/explore", label: "Jelajahi" },
  { href: "/tailor", label: "Penjahit" },
  { href: "/orders", label: "Pesanan" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { state, cartCount, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--color-surface-border)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-lg">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">FitStyle</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300",
                pathname === l.href
                  ? "bg-brand-500/10 text-brand-600 dark:bg-brand-800/60 dark:text-brand-300 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            aria-label="Keranjang"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-brand text-white text-xs font-bold flex items-center justify-center animate-fade-in">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {state.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 p-1 pr-3 rounded-xl bg-black/5 dark:bg-white/10 border border-[var(--border-primary)] hover:bg-black/10 transition-all shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden ring-2 ring-brand-500/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={state.user?.avatar ?? ""}
                    alt={state.user?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)] truncate max-w-24">
                  {state.user?.name?.split(" ")[0]}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-52 glass rounded-xl shadow-xl overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-[var(--color-surface-border)]">
                    <p className="text-xs text-[var(--text-secondary)]">Masuk sebagai</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{state.user?.email}</p>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    <Package className="w-4 h-4" /> Pesanan Saya
                  </Link>
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="hidden sm:block btn-primary text-sm">
              Masuk
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-[var(--color-surface-border)] animate-fade-in">
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  pathname === l.href
                    ? "bg-brand-500/10 text-brand-600 dark:bg-brand-800/60 dark:text-brand-300"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                {l.label}
              </Link>
            ))}
            {!state.isLoggedIn && (
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 btn-primary text-sm text-center"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
