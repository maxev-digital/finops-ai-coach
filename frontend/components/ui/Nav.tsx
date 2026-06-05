"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/demo", label: "AI Coach" },
  { href: "/prompt-lab", label: "Prompt Lab" },
  { href: "/insights", label: "HR Insights" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-white">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <Brain size={18} className="text-navy-900" />
          </div>
          <span>FinCoach <span className="text-gold-400">AI</span></span>
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

        {/* Desktop CTA */}
        <Link
          href="/demo"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg transition-colors text-sm"
        >
          Try the Demo
        </Link>

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
          <Link
            href="/demo"
            onClick={() => setOpen(false)}
            className="block mt-3 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg text-sm text-center"
          >
            Try the Demo
          </Link>
        </div>
      )}
    </header>
  );
}
