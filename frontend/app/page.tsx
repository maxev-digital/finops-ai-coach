import Link from "next/link";
import {
  Brain, ShieldCheck, Users, TrendingUp,
  ArrowRight, CheckCircle, BarChart3, Zap,
} from "lucide-react";

const STATS = [
  { value: "91%", label: "of employees are stressed about finances" },
  { value: "48%", label: "have more debt than is manageable" },
  { value: "18%", label: "have only basic financial literacy" },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Personalized AI Coaching",
    description:
      "24/7 guidance tailored to each employee's goals, risk tolerance, and financial situation. Not generic advice — answers grounded in their actual profile.",
    color: "bg-brand-50 text-brand-700",
  },
  {
    icon: ShieldCheck,
    title: "Fiduciary Standard",
    description:
      "Every response follows fiduciary guardrails. The AI never recommends specific securities, never predicts returns, and always surfaces a human advisor when the situation calls for it.",
    color: "bg-wellness-50 text-wellness-700",
  },
  {
    icon: Users,
    title: "Employer Benefits Integration",
    description:
      "Automatically surfaces relevant 401(k) match, HSA, and ESPP opportunities based on the employee's question. Turns benefits confusion into benefit utilization.",
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: BarChart3,
    title: "HR Analytics",
    description:
      "Aggregated, privacy-safe insights for HR teams: top financial stress topics, goal completion rates, benefit gaps. Data your team can actually act on.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    icon: TrendingUp,
    title: "Prompt Engineering Layer",
    description:
      "Built-in evaluation tooling to compare prompt versions side-by-side. LLM-as-judge scoring on relevance, actionability, personalization, and safety.",
    color: "bg-rose-50 text-rose-700",
  },
  {
    icon: Zap,
    title: "Hybrid RAG Retrieval",
    description:
      "Combines pgvector semantic search over financial wellness documents with structured user context injection. Grounded responses, not hallucinations.",
    color: "bg-cyan-50 text-cyan-700",
  },
];

const STACK = [
  "FastAPI + Python 3.12",
  "PostgreSQL + pgvector",
  "Anthropic Claude (generation)",
  "OpenAI text-embedding-3-small",
  "Async SQLAlchemy",
  "Redis embedding cache",
  "Next.js 15 frontend",
  "Docker infrastructure",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20
                            rounded-full px-4 py-1.5 text-sm font-medium text-white/90 mb-8">
              <ShieldCheck size={14} className="text-wellness-400" />
              Fiduciary AI — built for enterprise financial wellness
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your employees deserve a{" "}
              <span className="text-wellness-400">financial coach</span>{" "}
              in their pocket
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
              AI-powered financial wellness coaching grounded in your employees&apos;
              real goals, benefits, and situation. Personalized. Fiduciary-first.
              Available 24/7.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/demo" className="inline-flex items-center gap-2 px-6 py-3
                bg-wellness-500 hover:bg-wellness-600 text-white font-semibold
                rounded-lg transition-colors text-base">
                Try the Live Demo <ArrowRight size={18} />
              </Link>
              <Link href="/prompt-lab" className="inline-flex items-center gap-2 px-6 py-3
                bg-white/10 hover:bg-white/20 border border-white/20 text-white
                font-semibold rounded-lg transition-colors text-base">
                See Prompt Engineering
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {STATS.map((s) => (
              <div key={s.value} className="text-center">
                <div className="text-4xl font-bold text-brand-800 mb-2">{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            Source: BrightPlan 2024 Wellness Barometer Survey
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="section-label mb-3">What it does</div>
          <h2 className="text-3xl font-bold text-slate-900">
            Every feature a financial wellness platform needs
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center
                              justify-center mb-4`}>
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label text-slate-400 mb-3">Under the hood</div>
            <h2 className="text-3xl font-bold">
              Production-grade stack, built from scratch
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">
              Same architecture used by enterprise financial wellness platforms —
              FastAPI, PostgreSQL + pgvector, Anthropic Claude.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STACK.map((item) => (
              <div key={item} className="flex items-center gap-2 bg-white/5
                                        border border-white/10 rounded-lg px-4 py-3">
                <CheckCircle size={14} className="text-wellness-400 shrink-0" />
                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/demo" className="inline-flex items-center gap-2 px-8 py-4
              bg-wellness-500 hover:bg-wellness-600 text-white font-semibold
              rounded-lg transition-colors text-base">
              See it working live <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
