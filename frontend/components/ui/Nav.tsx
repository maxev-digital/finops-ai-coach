import Link from "next/link";
import { Brain } from "lucide-react";

const links = [
  { href: "/demo", label: "AI Coach" },
  { href: "/prompt-lab", label: "Prompt Lab" },
  { href: "/insights", label: "HR Insights" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-slate-900">
          <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <span>FinCoach <span className="text-brand-700">AI</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900
                         hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/demo" className="btn-primary hidden md:inline-flex">
          Try the Demo
        </Link>
      </div>
    </header>
  );
}
