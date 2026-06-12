"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/demo", label: "AI Coach" },
  { href: "/prompt-lab", label: "Prompt Lab" },
  { href: "/insights", label: "HR Insights" },
  { href: "/architecture", label: "Architecture" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-white">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center shrink-0">
            <Brain size={18} className="text-navy-900" />
          </div>
          <div className="flex flex-col leading-none">
            <span>FinCoach <span className="text-gold-400">AI</span></span>
            <span className="text-[9px] text-white/30 font-normal mt-0.5 tracking-wide">by Max EV Digital</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
                  active
                    ? "bg-gold-500/15 text-gold-400"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          {status === "authenticated" && session ? (
            <>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center">
                  <User size={13} className="text-gold-400" />
                </div>
                <span className="max-w-[120px] truncate">{session.user.name ?? session.user.email}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-white/60 hover:text-white transition-colors font-medium px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg transition-colors text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-navy-900 px-6 py-4 space-y-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm rounded-lg font-medium transition-colors ${
                  active
                    ? "bg-gold-500/15 text-gold-400"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          {status === "authenticated" ? (
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
              className="flex items-center gap-2 mt-3 px-4 py-2.5 text-sm text-white/50 hover:text-white w-full rounded-lg hover:bg-white/10 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}
                className="block mt-2 px-4 py-2.5 text-sm text-white/60 rounded-lg hover:bg-white/10 hover:text-white transition-colors font-medium">
                Sign in
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}
                className="block mt-1 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg text-sm text-center">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
