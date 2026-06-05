import Link from "next/link";
import {
  Brain, ShieldCheck, TrendingUp,
  ArrowRight, CheckCircle, BarChart3, Zap,
  MessageSquare, Database, Sparkles, Quote,
  Target, DollarSign, Lightbulb,
  Heart, Scale, Home, Headphones, BookOpen, Users, FileText, Layers,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "91%", label: "of employees are stressed about finances" },
  { value: "48%", label: "have more debt than is manageable" },
  { value: "18%", label: "have only basic financial literacy" },
];

const EMPLOYEE_BENEFITS = [
  {
    icon: Brain,
    title: "Unmatched Personalization",
    desc: "Support every employee's unique financial situation. 24/7 guidance tailored to goals, risk tolerance, and employer benefits.",
  },
  {
    icon: ShieldCheck,
    title: "Fiduciary Standard Built In",
    desc: "Every response follows fiduciary guardrails. No specific security recommendations. Human advisor escalation when warranted.",
  },
  {
    icon: DollarSign,
    title: "Fully Utilize Benefits",
    desc: "Employer 401(k) match, HSA, and ESPP opportunities surfaced automatically in context. Turns benefits confusion into utilization.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    desc: "Set, track, and progress toward financial goals — emergency fund, debt payoff, retirement — with AI guidance at each milestone.",
  },
];

const EMPLOYER_BENEFITS = [
  {
    icon: BarChart3,
    title: "Workforce-Level Analytics",
    desc: "Aggregated, privacy-safe HR insights: top financial stress topics, benefit gaps, goal completion rates — data you can act on.",
  },
  {
    icon: Lightbulb,
    title: "The Future of Benefits, Simplified",
    desc: "Employee benefits pulled forward inside financial guidance. Maximize benefit visibility without extra HR touchpoints.",
  },
  {
    icon: Zap,
    title: "Prompt Engineering Layer",
    desc: "LLM-as-judge evaluation tooling to compare prompt versions. Measurable quality improvement with side-by-side scoring.",
  },
  {
    icon: TrendingUp,
    title: "Hybrid RAG Retrieval",
    desc: "pgvector semantic search over financial wellness documents + structured user context injection. Grounded answers, not hallucinations.",
  },
];

const SOLUTIONS = [
  {
    id: "coaching",
    label: "AI Coach",
    title: "Just Ask Your AI Coach",
    desc: "The FinCoach AI generative overlay delivers instant, personalized financial guidance tailored to each employee's unique situation, benefits, and goals.",
    bullets: [
      "Unmatched personalization at scale",
      "Optimize benefit adoption and utilization",
      "Improved productivity and engagement",
      "Actionable data and trends for employers",
    ],
    href: "/demo",
    cta: "Try the Coach",
  },
  {
    id: "prompts",
    label: "Prompt Lab",
    title: "Prompt Engineering & Evaluation",
    desc: "Run any question through two prompt versions side-by-side. Claude acts as judge and scores both on relevance, actionability, personalization, and fiduciary safety.",
    bullets: [
      "V1 baseline vs. V2 production prompt comparison",
      "LLM-as-judge scoring on 4 dimensions",
      "Improvement summary with winner declaration",
      "Full response text for both versions",
    ],
    href: "/prompt-lab",
    cta: "Open Prompt Lab",
  },
  {
    id: "insights",
    label: "HR Insights",
    title: "Workforce Financial Analytics",
    desc: "A privacy-safe HR dashboard showing aggregated financial wellness metrics across your enrolled workforce. Individual data is never surfaced.",
    bullets: [
      "Emergency fund and retirement coverage rates",
      "Benefits utilization (401k, HSA, ESPP)",
      "Top financial goals by frequency",
      "Wellness gap alerts and recommendations",
    ],
    href: "/insights",
    cta: "See Insights",
  },
];

const STACK = [
  { label: "FastAPI + Python 3.12", cat: "Backend" },
  { label: "PostgreSQL + pgvector 0.8.2", cat: "Vector DB" },
  { label: "Anthropic Claude", cat: "Generation" },
  { label: "OpenAI Embeddings", cat: "Embeddings" },
  { label: "Async SQLAlchemy", cat: "ORM" },
  { label: "Redis Embedding Cache", cat: "Cache" },
  { label: "Next.js 15 App Router", cat: "Frontend" },
  { label: "Docker + PM2", cat: "Infra" },
];

const TESTIMONIALS = [
  {
    quote:
      "The generative overlay pattern is exactly what enterprise financial wellness platforms are building. RAG-grounded responses with fiduciary guardrails built in — this is the right architecture.",
    author: "Applied AI Engineering",
    role: "Enterprise Financial Wellness",
  },
  {
    quote:
      "Finally, financial guidance that knows my 401(k) match and my emergency fund situation at the same time. The personalization is night-and-day compared to generic advice.",
    author: "Demo User — Sarah M.",
    role: "Software Engineer, Tech Company",
  },
  {
    quote:
      "The prompt comparison tool is brilliant for showing measurable quality improvements. V1 vs V2 side-by-side with an LLM judge scoring four dimensions — this is how you build responsibly.",
    author: "Demo User — Marcus T.",
    role: "HR Benefits Manager",
  },
];

const MOCK_MESSAGES = [
  { role: "user", text: "Should I max my 401(k) or pay off student loans first?" },
  {
    role: "ai",
    text: "Given your 6% employer match, I'd contribute at least 6% first — that's a guaranteed 100% return. Beyond that, compare your loan APR to expected market returns…",
    sources: 2,
  },
  { role: "user", text: "What about my HSA this year?" },
];

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,200,66,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.2),transparent_60%)]" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-28 grid md:grid-cols-2 gap-14 items-center">
          {/* Copy */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 bg-gold-500/15 border border-gold-500/30 rounded-full px-3 py-1">
                <Layers size={10} className="text-gold-400" />
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">Max EV Digital · Architecture Demo</span>
              </div>
            </div>
            <small className="block mb-3 text-xs font-bold uppercase tracking-[2px] text-white/40">
              Generative overlay pattern · Enterprise financial wellness
            </small>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              Your employees deserve a{" "}
              <span className="text-gold-400">financial coach</span>{" "}
              in their pocket
            </h1>
            <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed">
              A RAG-powered AI layer on top of your existing benefits data.
              Personalized. Fiduciary-first. Grounded in retrieved sources — not
              hallucinations.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600
                           text-navy-900 font-bold rounded-lg transition-colors text-sm"
              >
                Try the Live Demo <ArrowRight size={16} />
              </Link>
              <Link
                href="/prompt-lab"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10
                           hover:bg-white/20 border border-white/20 text-white
                           font-semibold rounded-lg transition-colors text-sm"
              >
                See Prompt Engineering
              </Link>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-6 border-t border-white/10">
              {["Async FastAPI", "pgvector RAG", "Claude-as-judge eval", "Fiduciary guardrails"].map((tag) => (
                <div key={tag} className="flex items-center gap-1.5 text-xs text-white/60">
                  <CheckCircle size={11} className="text-gold-400" />
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Chat mockup */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 rounded-2xl bg-gold-500/15 blur-2xl scale-95" />
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Browser bar */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-slate-400 border border-slate-200">
                    fincoach.maxevdigital.com/demo
                  </div>
                </div>
                {/* Chat header */}
                <div className="bg-navy-800 px-4 py-3 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gold-500/30 flex items-center justify-center">
                    <Brain size={14} className="text-gold-300" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">FinCoach AI</div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                      <span className="text-xs text-white/60">Live · RAG v2</span>
                    </div>
                  </div>
                </div>
                {/* Messages */}
                <div className="p-4 space-y-3 bg-slate-50">
                  {MOCK_MESSAGES.map((m, i) =>
                    m.role === "user" ? (
                      <div key={i} className="flex justify-end">
                        <div className="bg-navy-800 text-white text-xs rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%] leading-relaxed">
                          {m.text}
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-navy-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Brain size={11} className="text-gold-400" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-white border border-slate-200 text-slate-700 text-xs rounded-2xl rounded-tl-sm px-3 py-2 leading-relaxed shadow-sm">
                            {m.text}
                          </div>
                          {m.sources && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <Sparkles size={9} className="text-gold-500" />
                              {m.sources} sources retrieved
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                  {/* Typing dots */}
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-navy-800 flex items-center justify-center shrink-0">
                      <Brain size={11} className="text-gold-400" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Input */}
                <div className="border-t border-slate-200 px-4 py-3 bg-white flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-xs text-slate-400">
                    Ask your financial wellness question…
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-navy-800 flex items-center justify-center">
                    <ArrowRight size={13} className="text-gold-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────────────────── */}
      <section className="bg-navy-800 text-white py-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {STATS.map((s) => (
              <div key={s.value} className="text-center py-4 md:py-0 first:pt-0 last:pb-0">
                <div className="text-5xl font-bold text-gold-400 mb-2 tabular-nums">{s.value}</div>
                <div className="text-sm text-white/70 max-w-[180px] mx-auto leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-white/30 mt-6">
            Source: BrightPlan 2024 Wellness Barometer Survey
          </p>
        </div>
      </section>

      {/* ─── SOLUTIONS TABS ────────────────────────────────────────────────── */}
      <section className="bg-navy-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <small className="block mb-2 text-xs font-bold uppercase tracking-[2px] text-gold-400">
              What the demo covers
            </small>
            <h2 className="text-3xl font-bold text-white">
              <span className="text-gold-400">Scalable</span> financial wellness for any workforce
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {SOLUTIONS.map((sol) => (
              <div
                key={sol.id}
                className="relative rounded-2xl p-px bg-gradient-to-b from-gold-500/40 to-gold-500/0"
              >
                <div className="bg-navy-800 rounded-2xl p-6 h-full flex flex-col">
                  <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/30 rounded-full px-3 py-1 text-xs font-bold text-gold-400 mb-4 self-start">
                    {sol.label}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{sol.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-4 flex-1">{sol.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {sol.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle size={13} className="text-gold-400 mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={sol.href}
                    className="inline-flex items-center gap-2 text-sm font-bold text-gold-400 hover:text-gold-300 transition-colors mt-auto"
                  >
                    {sol.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <small className="block mb-2 text-xs font-bold uppercase tracking-[2px] text-sky-600">
              The generative overlay pattern
            </small>
            <h2 className="text-3xl font-bold text-slate-900">
              How <span className="text-brand-700">FinCoach AI</span> works
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Same architecture as BrightPlan&apos;s &ldquo;Just Ask&rdquo; feature — a generative layer on
              top of existing employee benefits and financial data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector lines */}
            <div className="hidden md:block absolute top-[52px] left-[calc(33.3%+12px)] w-[calc(33.3%-24px)] h-px bg-gradient-to-r from-brand-300 to-purple-300" />
            <div className="hidden md:block absolute top-[52px] left-[calc(66.6%+12px)] w-[calc(33.3%-24px)] h-px bg-gradient-to-r from-purple-300 to-wellness-500" />

            {[
              {
                step: "01", icon: MessageSquare, color: "bg-brand-50 border-brand-300 text-brand-700",
                title: "Employee asks a question",
                desc: "A natural-language question about their 401(k) match, emergency fund, or debt payoff goes to the generative overlay.",
                example: '"Should I prioritize my emergency fund or 401(k) contributions?"',
              },
              {
                step: "02", icon: Database, color: "bg-purple-50 border-purple-300 text-purple-700",
                title: "RAG retrieves + personalizes",
                desc: "pgvector finds the most relevant financial wellness documents. Structured user context — goals, benefits, profile — is injected into every prompt.",
                example: "Retirement docs + HSA policy + employee profile → Claude",
              },
              {
                step: "03", icon: ShieldCheck, color: "bg-wellness-50 border-wellness-500 text-wellness-700",
                title: "Grounded, fiduciary answer",
                desc: "Claude generates a response tethered to retrieved sources, personalized to the individual — with fiduciary guardrails enforced at the prompt level.",
                example: '"Based on your 6% employer match and $85k salary, here\'s what I\'d do first…"',
              },
            ].map((s) => (
              <div key={s.step} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl border-2 ${s.color} flex items-center justify-center shrink-0`}>
                    <s.icon size={22} />
                  </div>
                  <span className="text-3xl font-bold text-slate-100 leading-none">{s.step}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-slate-500 italic leading-relaxed">{s.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMPACT (Employee vs HR) ────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <small className="block mb-2 text-xs font-bold uppercase tracking-[2px] text-gold-600">
              Impact
            </small>
            <h2 className="text-3xl font-bold text-slate-900">
              Differentiated experience for <span className="text-brand-700">everyone</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Employees */}
            <div className="relative rounded-2xl p-px bg-gradient-to-b from-brand-400/50 to-transparent">
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="text-center py-5 px-6 bg-brand-50">
                  <h3 className="text-xl font-bold text-brand-800 mb-2">For Employees</h3>
                  <div className="inline-block px-6 py-1.5 bg-brand-700 text-white text-sm font-bold rounded-full">
                    Personalized coaching
                  </div>
                </div>
                <div className="p-6 bg-white rounded-b-2xl shadow-sm space-y-4">
                  {EMPLOYEE_BENEFITS.map((b) => (
                    <div
                      key={b.title}
                      className="relative rounded-xl p-px bg-gradient-to-b from-brand-200/50 to-transparent"
                    >
                      <div className="bg-brand-50/30 rounded-xl p-4 flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                          <b.icon size={18} className="text-brand-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-800 text-sm mb-1">{b.title}</p>
                          <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* HR */}
            <div className="relative rounded-2xl p-px bg-gradient-to-b from-gold-400/50 to-transparent">
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="text-center py-5 px-6 bg-gold-50">
                  <h3 className="text-xl font-bold text-navy-800 mb-2">For HR Teams</h3>
                  <div className="inline-block px-6 py-1.5 bg-navy-800 text-white text-sm font-bold rounded-full">
                    Workforce analytics
                  </div>
                </div>
                <div className="p-6 bg-white rounded-b-2xl shadow-sm space-y-4">
                  {EMPLOYER_BENEFITS.map((b) => (
                    <div
                      key={b.title}
                      className="relative rounded-xl p-px bg-gradient-to-b from-gold-200/50 to-transparent"
                    >
                      <div className="bg-gold-50/30 rounded-xl p-4 flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center shrink-0">
                          <b.icon size={18} className="text-gold-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-navy-800 text-sm mb-1">{b.title}</p>
                          <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900"
            >
              See the live HR insights dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="bg-navy-900 py-20 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <small className="block mb-2 text-xs font-bold uppercase tracking-[2px] text-gold-400">
              What demo users are saying
            </small>
            <h2 className="text-3xl font-bold">
              Built for the{" "}
              <span className="text-gold-400">real-world problem</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="relative rounded-xl p-px bg-gradient-to-b from-gold-500/30 to-gold-500/0">
                <div className="bg-navy-800 rounded-xl p-6 h-full flex flex-col">
                  <Quote size={28} className="text-gold-500 mb-4 opacity-70" />
                  <blockquote className="text-sm text-white/75 leading-relaxed flex-1 italic">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <p className="font-bold text-white text-sm">{t.author}</p>
                    <p className="text-xs text-white/50 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ANY VERTICAL ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-navy-900 rounded-full px-4 py-1.5 mb-5">
              <Layers size={12} className="text-gold-400" />
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Max EV Digital</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              One architecture.{" "}
              <span className="text-navy-800">Any vertical.</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
              FinCoach is the financial wellness implementation of a pattern Max EV Digital deploys across industries.
              The knowledge base changes. The RAG pipeline, fiduciary guardrails, and HR analytics layer stay the same.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              {
                icon: Brain,
                industry: "Financial Wellness",
                rag: "401k, HSA, budgeting, retirement planning guides",
                guardrails: "Fiduciary — no investment advice or specific security recs",
                status: "Live Demo",
                live: true,
              },
              {
                icon: Heart,
                industry: "Healthcare / Clinical",
                rag: "Clinical guidelines, drug interactions, formulary docs",
                guardrails: "HIPAA-aware — no diagnosis, always refer to physician",
                status: "Ready to build",
                live: false,
              },
              {
                icon: Scale,
                industry: "Legal Research",
                rag: "Case law, firm playbooks, jurisdiction-specific statutes",
                guardrails: "No attorney-client privilege — refer to licensed counsel",
                status: "Ready to build",
                live: false,
              },
              {
                icon: Users,
                industry: "HR & People Ops",
                rag: "Employee handbook, labor law, EEOC regulations",
                guardrails: "No legal conclusions — HR manager review required",
                status: "Ready to build",
                live: false,
              },
              {
                icon: Home,
                industry: "Real Estate",
                rag: "MLS comparables, zoning codes, neighborhood market reports",
                guardrails: "No appreciation guarantees — licensed agent required",
                status: "Ready to build",
                live: false,
              },
              {
                icon: FileText,
                industry: "Insurance",
                rag: "Policy documents, claims guides, underwriting rules",
                guardrails: "No coverage guarantees — licensed agent review required",
                status: "Ready to build",
                live: false,
              },
              {
                icon: Headphones,
                industry: "Customer Support",
                rag: "Product docs, return policies, troubleshooting runbooks",
                guardrails: "Escalate billing disputes and edge cases to human agents",
                status: "Ready to build",
                live: false,
              },
              {
                icon: BookOpen,
                industry: "Education / L&D",
                rag: "Course curriculum, assessments, learning objectives",
                guardrails: "No credential guarantees — academic advisor for formal decisions",
                status: "Ready to build",
                live: false,
              },
            ].map(({ icon: Icon, industry, rag, guardrails, status, live }) => (
              <div
                key={industry}
                className={`rounded-xl p-5 border transition-shadow hover:shadow-md ${
                  live
                    ? "bg-navy-900 border-gold-500/40 ring-1 ring-gold-500/20"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    live ? "bg-gold-500/20" : "bg-white border border-slate-200"
                  }`}>
                    <Icon size={16} className={live ? "text-gold-400" : "text-slate-500"} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    live
                      ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                      : "bg-white text-slate-500 border border-slate-200"
                  }`}>
                    {status}
                  </span>
                </div>
                <h3 className={`font-bold text-sm mb-2 ${live ? "text-white" : "text-slate-900"}`}>
                  {industry}
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${live ? "text-gold-500/70" : "text-slate-400"}`}>
                      RAG docs
                    </span>
                    <p className={`text-[11px] leading-relaxed mt-0.5 ${live ? "text-white/60" : "text-slate-500"}`}>{rag}</p>
                  </div>
                  <div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${live ? "text-gold-500/70" : "text-slate-400"}`}>
                      Guardrails
                    </span>
                    <p className={`text-[11px] leading-relaxed mt-0.5 ${live ? "text-white/60" : "text-slate-500"}`}>{guardrails}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 mb-2">
              The knowledge base and guardrails are the only things that change between verticals.
            </p>
            <p className="text-xs text-slate-400">
              Same FastAPI backend · same pgvector retrieval · same Next.js frontend · same Claude generation
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-navy-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/25 rounded-full px-4 py-1.5 mb-6">
            <Zap size={11} className="text-gold-400" />
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Max EV Digital</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
            Want this built for{" "}
            <span className="text-gold-400">your vertical?</span>
          </h2>
          <p className="text-white/60 text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            This is a live, production-quality demonstration of the RAG coaching pattern.
            Max EV Digital builds specialized AI systems like this — with your knowledge base,
            your data integrations, and your compliance requirements.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link
              href="/architecture"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg transition-colors"
            >
              See the Architecture <ArrowRight size={16} />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold rounded-lg transition-colors"
            >
              Try the Live Demo
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5 text-left">
            {[
              { title: "Bring your knowledge base", body: "PDFs, internal wikis, policy documents, regulatory content — we ingest, chunk, embed, and make it retrievable." },
              { title: "We wire your data integrations", body: "User profiles, account data, CRM records — structured context injected into every prompt alongside retrieved docs." },
              { title: "Guardrails for your domain", body: "Legal, medical, financial, HR — every vertical has different liability lines. We design the system prompt around yours." },
            ].map(({ title, body }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <CheckCircle size={14} className="text-gold-400 mb-3" />
                <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TECH STACK ────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <small className="block mb-2 text-xs font-bold uppercase tracking-[2px] text-gold-400">
              Under the hood
            </small>
            <h2 className="text-3xl font-bold">
              Production-grade stack,{" "}
              <span className="text-gold-400">built from scratch</span>
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
              Same architecture used by enterprise financial wellness platforms —
              async FastAPI, PostgreSQL + pgvector, Anthropic Claude generation.
            </p>
          </div>

          {/* Architecture flow */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-10 text-xs">
            {[
              { label: "Employee", color: "bg-navy-800 border-gold-500/40 text-white" },
              null,
              { label: "Next.js", color: "bg-slate-700 border-slate-600 text-white" },
              null,
              { label: "FastAPI", color: "bg-slate-700 border-slate-600 text-white" },
              null,
              { label: "pgvector", color: "bg-purple-900 border-purple-700 text-white" },
              null,
              { label: "Claude", color: "bg-brand-900 border-brand-700 text-gold-300" },
            ].map((node, i) =>
              node === null ? (
                <ArrowRight key={i} size={14} className="text-gold-500/50 shrink-0" />
              ) : (
                <div key={i} className={`px-3 py-2 rounded-lg border ${node.color} font-medium`}>
                  {node.label}
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {STACK.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="text-xs text-gold-500/70 uppercase tracking-wide">{item.cat}</span>
                <div className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-gold-400 shrink-0" />
                  <span className="text-sm text-slate-300 font-medium leading-snug">{item.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600
                         text-navy-900 font-bold rounded-lg transition-colors text-base"
            >
              See it working live <ArrowRight size={18} />
            </Link>
            <p className="text-slate-500 text-xs mt-3">
              Live demo · real API · real RAG retrieval
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
