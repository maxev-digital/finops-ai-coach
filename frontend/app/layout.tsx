import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/ui/Nav";
import Link from "next/link";
import { Brain, Github, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "FinCoach AI — Financial Wellness Coach",
  description:
    "RAG-powered generative AI overlay for enterprise financial wellness. " +
    "Personalized coaching grounded in your goals, benefits, and financial profile. " +
    "Fiduciary guardrails built-in.",
  openGraph: {
    title: "FinCoach AI — Financial Wellness Coach",
    description:
      "A generative overlay on top of employee benefits data. Personalized. " +
      "Fiduciary-first. Built with FastAPI, pgvector, and Anthropic Claude.",
    url: "https://fincoach.maxevdigital.com",
    siteName: "FinCoach AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinCoach AI — Financial Wellness Coach",
    description: "RAG-powered AI financial wellness coaching with fiduciary guardrails.",
  },
};

const FOOTER_LINKS = [
  { href: "/demo", label: "AI Coach" },
  { href: "/prompt-lab", label: "Prompt Lab" },
  { href: "/insights", label: "HR Insights" },
  { href: "/architecture", label: "Architecture" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-navy-900 text-white border-t border-white/10">
          {/* Top strip */}
          <div className="bg-white/5 py-4">
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-center text-xs text-white/40 font-medium tracking-wide uppercase">
                FastAPI · pgvector · Anthropic Claude · Next.js 15 · Docker
              </p>
            </div>
          </div>

          {/* Main footer */}
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid md:grid-cols-3 gap-10 mb-8">
              {/* Brand */}
              <div>
                <Link href="/" className="flex items-center gap-2.5 font-semibold text-white mb-4">
                  <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
                    <Brain size={17} className="text-navy-900" />
                  </div>
                  <span>FinCoach <span className="text-gold-400">AI</span></span>
                </Link>
                <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                  A production-quality prototype of the generative overlay pattern —
                  RAG-powered financial wellness coaching built on FastAPI, pgvector, and Anthropic Claude.
                </p>
              </div>

              {/* Nav */}
              <div>
                <p className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-4">Demo Pages</p>
                <ul className="space-y-2">
                  {FOOTER_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stack + GitHub */}
              <div>
                <p className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-4">Stack</p>
                <ul className="space-y-1.5 mb-5">
                  {[
                    "FastAPI + pgvector",
                    "Anthropic Claude (claude-sonnet-4-6)",
                    "OpenAI text-embedding-3-small",
                    "Next.js 15 App Router",
                  ].map((s) => (
                    <li key={s} className="text-sm text-white/50">{s}</li>
                  ))}
                </ul>
                <a
                  href="https://github.com/maxev-digital/finops-ai-coach"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 font-medium"
                >
                  <Github size={14} />
                  View on GitHub
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-white/30 max-w-2xl">
                FinCoach AI provides general financial wellness education only — not personalized financial,
                tax, or investment advice. Consult a licensed financial advisor for decisions specific to your situation.
              </p>
              <p className="text-xs text-white/20 shrink-0">
                Demo by Max EV Digital
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
