import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Database, Cpu, Globe, ArrowRight, Github, ExternalLink, Layers, Zap, Shield, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "System Architecture — FinCoach AI",
  description: "Full-stack RAG pipeline architecture: FastAPI, pgvector, Anthropic Claude, OpenAI embeddings, Next.js 15.",
};

const NAVY   = "#0d2137";
const GOLD   = "#f5c842";
const WHITE  = "#ffffff";
const SLATE  = "#f8fafc";
const BORDER = "#e2e8f0";
const DIM    = "#64748b";
const LABEL  = "#94a3b8";

type LayerCard = { title: string; sub: string; color: string; bg: string; border: string };

const LAYERS: LayerCard[] = [
  { title: "Frontend Layer",  sub: "Next.js 15 App Router · React · Tailwind CSS · TypeScript", color: "#f5c842", bg: "#fffbeb", border: "#fde68a" },
  { title: "API Layer",       sub: "FastAPI · Python 3.11 · Pydantic · Async I/O",              color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { title: "AI Layer",        sub: "Anthropic Claude · OpenAI Embeddings · RAG Pipeline",        color: "#8b5cf6", bg: "#faf5ff", border: "#ddd6fe" },
  { title: "Data Layer",      sub: "PostgreSQL + pgvector · Redis Cache · Seeded demo data",     color: "#10b981", bg: "#f0fdf4", border: "#a7f3d0" },
];

export default function ArchitecturePage() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #162d47 60%, #1e3a5f 100%)`, color: WHITE, padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.25)", borderRadius: 20 }}>
              <Layers size={12} style={{ color: GOLD }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Full-Stack RAG Architecture</span>
            </div>
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.1 }}>
            System Architecture
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", maxWidth: 640, lineHeight: 1.7, marginBottom: 28 }}>
            A production-quality RAG pipeline for enterprise financial wellness coaching —
            built on FastAPI, pgvector, Anthropic Claude, and Next.js 15.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="https://github.com/maxev-digital/finops-ai-coach" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: WHITE, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
              <Github size={14} />
              View on GitHub
              <ExternalLink size={11} style={{ opacity: 0.6 }} />
            </a>
            <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: GOLD, borderRadius: 8, color: NAVY, fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>
              <Brain size={14} />
              Try Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Layer Badges ──────────────────────────────────────────────────── */}
      <section style={{ background: SLATE, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {LAYERS.map((l) => (
              <div key={l.title} style={{ background: l.bg, border: `1px solid ${l.border}`, borderLeft: `4px solid ${l.color}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: l.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{l.title}</div>
                <div style={{ fontSize: "0.68rem", color: DIM, lineHeight: 1.5 }}>{l.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Diagram ───────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: LABEL, textTransform: "uppercase", marginBottom: 20 }}>System Diagram</div>

          {/* Browser/User */}
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "#f1f5f9", border: `1px solid ${BORDER}`, borderRadius: 10 }}>
              <Globe size={16} style={{ color: DIM }} />
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: NAVY }}>Browser / HR Admin</span>
            </div>
          </div>

          {/* Arrow down */}
          <DiagramArrow label="HTTPS · Port 3035" />

          {/* Frontend layer */}
          <div style={{ background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 14, padding: "16px 20px", marginBottom: 8 }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Frontend — Next.js 15 App Router</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {[
                { path: "/",             label: "Landing",      desc: "BrightPlan-style hero" },
                { path: "/demo",         label: "AI Coach",     desc: "Chat + session history" },
                { path: "/prompt-lab",   label: "Prompt Lab",   desc: "Persona comparison" },
                { path: "/insights",     label: "HR Insights",  desc: "Control panel dashboard" },
                { path: "/architecture", label: "Architecture", desc: "This page" },
              ].map((p) => (
                <div key={p.path} style={{ background: WHITE, border: "1px solid #fde68a", borderRadius: 8, padding: "10px 10px" }}>
                  <div style={{ fontSize: "0.63rem", color: "#92400e", fontWeight: 700, marginBottom: 3 }}>{p.path}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: NAVY, marginBottom: 2 }}>{p.label}</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow down */}
          <DiagramArrow label="REST API · Port 8002 (internal)" />

          {/* API layer */}
          <div style={{ background: "#f0f9ff", border: "2px solid #bae6fd", borderRadius: 14, padding: "16px 20px", marginBottom: 8 }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>API Layer — FastAPI (Python 3.11)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {[
                { path: "POST /coach",   label: "Coach",     desc: "RAG query + Claude generation" },
                { path: "GET /users",    label: "Users",     desc: "Employee data + goals + benefits" },
                { path: "POST /ingest",  label: "Ingest",    desc: "Document chunking + embedding" },
                { path: "GET /health",   label: "Health",    desc: "System + DB connectivity" },
                { path: "POST /prompt",  label: "Prompt Lab",desc: "Multi-persona comparison" },
              ].map((p) => (
                <div key={p.path} style={{ background: WHITE, border: "1px solid #bae6fd", borderRadius: 8, padding: "10px 10px" }}>
                  <div style={{ fontSize: "0.61rem", color: "#0369a1", fontWeight: 700, marginBottom: 3 }}>{p.path}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: NAVY, marginBottom: 2 }}>{p.label}</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2-column split for AI + Data */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <DiagramArrow label="Embedding + Completion calls" />
              {/* AI layer */}
              <div style={{ background: "#faf5ff", border: "2px solid #ddd6fe", borderRadius: 14, padding: "16px 20px" }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#6d28d9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>AI Layer — External APIs</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { icon: "✦", label: "Anthropic Claude",         sub: "claude-sonnet-4-6", desc: "RAG generation · fiduciary guardrails · streaming", color: "#8b5cf6" },
                    { icon: "⊛", label: "OpenAI Embeddings",        sub: "text-embedding-3-small", desc: "1536-dim vectors · semantic search · cached in Redis", color: "#10b981" },
                  ].map((c) => (
                    <div key={c.label} style={{ background: WHITE, border: "1px solid #ddd6fe", borderRadius: 8, padding: "12px 12px" }}>
                      <div style={{ fontSize: "1rem", marginBottom: 5 }}>{c.icon}</div>
                      <div style={{ fontSize: "0.74rem", fontWeight: 700, color: NAVY, marginBottom: 2 }}>{c.label}</div>
                      <div style={{ fontSize: "0.62rem", color: c.color, fontWeight: 600, marginBottom: 4 }}>{c.sub}</div>
                      <div style={{ fontSize: "0.63rem", color: DIM, lineHeight: 1.45 }}>{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <DiagramArrow label="pgvector similarity search + Redis cache" />
              {/* Data layer */}
              <div style={{ background: "#f0fdf4", border: "2px solid #a7f3d0", borderRadius: 14, padding: "16px 20px" }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Data Layer — PostgreSQL + Redis</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { icon: "🗄", label: "PostgreSQL + pgvector", sub: "Vector similarity search", desc: "Employee profiles · goals · benefits · document chunks · embeddings", color: "#10b981" },
                    { icon: "⚡", label: "Redis Cache",            sub: "Embedding memoization",   desc: "Caches OpenAI embedding calls · reduces API cost · TTL-managed", color: "#f59e0b" },
                  ].map((c) => (
                    <div key={c.label} style={{ background: WHITE, border: "1px solid #a7f3d0", borderRadius: 8, padding: "12px 12px" }}>
                      <div style={{ fontSize: "1rem", marginBottom: 5 }}>{c.icon}</div>
                      <div style={{ fontSize: "0.74rem", fontWeight: 700, color: NAVY, marginBottom: 2 }}>{c.label}</div>
                      <div style={{ fontSize: "0.62rem", color: c.color, fontWeight: 600, marginBottom: 4 }}>{c.sub}</div>
                      <div style={{ fontSize: "0.63rem", color: DIM, lineHeight: 1.45 }}>{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Request Trace ──────────────────────────────────────────────────── */}
      <section style={{ background: SLATE, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: LABEL, textTransform: "uppercase", marginBottom: 6 }}>Coaching Query — Request Trace</div>
          <p style={{ fontSize: "0.78rem", color: DIM, marginBottom: 24 }}>What happens when an employee asks &ldquo;How should I allocate my 401k match?&rdquo;</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { step: "1", title: "User submits question",   body: "Employee types a question in the AI Coach chat. Next.js sends a POST to FastAPI /coach with the question + user_id.", layer: "Frontend",   color: "#f5c842", border: "#fde68a", bg: "#fffbeb" },
              { step: "2", title: "Embed the query",         body: "FastAPI calls OpenAI text-embedding-3-small. Checks Redis cache first — on hit, skips the API call and saves cost.", layer: "API + Cache", color: "#f59e0b", border: "#fde68a", bg: "#fffbeb" },
              { step: "3", title: "Vector similarity search",body: "pgvector finds the top-k most similar document chunks to the query embedding — financial guides, the employee's own benefits profile, and their active goals.", layer: "Data Layer",  color: "#10b981", border: "#a7f3d0", bg: "#f0fdf4" },
              { step: "4", title: "Build RAG prompt",        body: "FastAPI assembles a prompt: system guardrails (fiduciary scope) + retrieved context + employee profile + the original question.", layer: "API",        color: "#0ea5e9", border: "#bae6fd", bg: "#f0f9ff" },
              { step: "5", title: "Claude generation",       body: "Anthropic Claude (claude-sonnet-4-6) generates a response grounded in the retrieved context. Guardrails prevent investment advice or product recs.", layer: "AI Layer",   color: "#8b5cf6", border: "#ddd6fe", bg: "#faf5ff" },
              { step: "6", title: "Source citations",        body: "Response includes which document chunks were used as context — full RAG transparency so HR and compliance can audit any answer.", layer: "AI Layer",   color: "#8b5cf6", border: "#ddd6fe", bg: "#faf5ff" },
              { step: "7", title: "API response",            body: "FastAPI returns JSON with the answer text, cited sources, session_id, and token usage. Saves the session to PostgreSQL for history.", layer: "API",        color: "#0ea5e9", border: "#bae6fd", bg: "#f0f9ff" },
              { step: "8", title: "Rendered in chat UI",     body: "Next.js renders the answer in the chat thread. Session history is preserved. Employee can follow up or start a new coaching session.", layer: "Frontend",   color: "#f5c842", border: "#fde68a", bg: "#fffbeb" },
            ].map(({ step, title, body, layer, color, border, bg }) => (
              <div key={step} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "16px 15px", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 900, color: NAVY, flexShrink: 0 }}>{step}</div>
                  <span style={{ fontSize: "0.58rem", padding: "2px 7px", background: WHITE, border: `1px solid ${border}`, borderRadius: 4, color: DIM, fontWeight: 600 }}>{layer}</span>
                </div>
                <div style={{ fontSize: "0.77rem", fontWeight: 700, color: NAVY, marginBottom: 6, lineHeight: 1.3 }}>{title}</div>
                <div style={{ fontSize: "0.68rem", color: DIM, lineHeight: 1.55 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Component Deep-Dive ────────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: LABEL, textTransform: "uppercase", marginBottom: 24 }}>Component Deep-Dive</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>

            {/* RAG Pipeline */}
            <div style={{ background: SLATE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#faf5ff", border: "1px solid #ddd6fe", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Cpu size={15} style={{ color: "#8b5cf6" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>RAG Pipeline</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>Retrieval-Augmented Generation</div>
                </div>
              </div>
              <div style={{ fontSize: "0.7rem", color: DIM, lineHeight: 1.65, marginBottom: 14 }}>
                Document chunks are embedded at ingest time and stored in pgvector. At query time, the user&apos;s question is embedded and the top-k most relevant chunks are retrieved by cosine similarity, then injected into the Claude prompt as grounding context.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {["Chunk size: ~400 tokens", "Overlap: 50 tokens", "Top-k retrieval: 5 chunks", "Similarity metric: cosine", "Embedding dim: 1536"].map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#8b5cf6", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.68rem", color: DIM }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedding Cache */}
            <div style={{ background: SLATE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={15} style={{ color: "#f59e0b" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>Redis Embedding Cache</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>Cost optimization layer</div>
                </div>
              </div>
              <div style={{ fontSize: "0.7rem", color: DIM, lineHeight: 1.65, marginBottom: 14 }}>
                Embedding an identical or near-identical query twice wastes API credits. Redis caches the (text → embedding vector) mapping with a configurable TTL. On cache hit, FastAPI skips the OpenAI API call entirely — zero latency, zero cost.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {["Cache key: SHA-256(query_text)", "TTL: 24 hours", "Serialization: pickle / JSON", "Hit ratio: ~40% in demo", "Savings: ~$0.01 per 1k hits"].map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.68rem", color: DIM }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fiduciary Guardrails */}
            <div style={{ background: SLATE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#f0fdf4", border: "1px solid #a7f3d0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield size={15} style={{ color: "#10b981" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>Fiduciary Guardrails</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>Compliance-first design</div>
                </div>
              </div>
              <div style={{ fontSize: "0.7rem", color: DIM, lineHeight: 1.65, marginBottom: 14 }}>
                Every Claude prompt includes a system instruction that scopes responses to general financial wellness education only. The model is explicitly instructed to decline investment advice, product recommendations, and tax guidance — all of which require licensure.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {["No specific investment recs", "No product endorsements", "No tax or legal advice", "ERISA-awareness baked in", "Source citations for transparency"].map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.68rem", color: DIM }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* pgvector Schema */}
            <div style={{ background: SLATE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#f0fdf4", border: "1px solid #a7f3d0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Database size={15} style={{ color: "#10b981" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>Database Schema</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>PostgreSQL + pgvector</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { table: "users",          cols: "id, name, email, department, salary" },
                  { table: "financial_profiles", cols: "user_id, monthly_savings, total_debt, has_emergency_fund, has_retirement_account" },
                  { table: "benefits",       cols: "user_id, has_401k, has_hsa, has_espp, employer_match_pct" },
                  { table: "goals",          cols: "user_id, goal_type, target_amount, current_amount, deadline" },
                  { table: "documents",      cols: "id, title, source, content, embedding vector(1536)" },
                  { table: "sessions",       cols: "id, user_id, messages jsonb, created_at" },
                ].map(({ table, cols }) => (
                  <div key={table}>
                    <div style={{ fontSize: "0.66rem", fontWeight: 700, color: "#0d9488", fontFamily: "monospace", marginBottom: 1 }}>{table}</div>
                    <div style={{ fontSize: "0.61rem", color: LABEL, fontFamily: "monospace" }}>{cols}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt Engineering */}
            <div style={{ background: SLATE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#faf5ff", border: "1px solid #ddd6fe", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={15} style={{ color: "#8b5cf6" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>Prompt Engineering</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>Persona-based coaching</div>
                </div>
              </div>
              <div style={{ fontSize: "0.7rem", color: DIM, lineHeight: 1.65, marginBottom: 12 }}>
                The Prompt Lab page lets HR compare three coaching personas on the same question — exposing how system prompt design affects tone, depth, and compliance posture.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { persona: "FinCoach Standard", desc: "Warm, educational, goal-focused" },
                  { persona: "Conservative",      desc: "Risk-averse, savings-first framing" },
                  { persona: "Growth-Oriented",   desc: "Wealth-building, equity-focused tone" },
                ].map(({ persona, desc }) => (
                  <div key={persona} style={{ padding: "8px 10px", background: WHITE, border: "1px solid #ddd6fe", borderRadius: 7 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6d28d9" }}>{persona}</div>
                    <div style={{ fontSize: "0.63rem", color: DIM }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure */}
            <div style={{ background: SLATE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Server size={15} style={{ color: "#0ea5e9" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>Infrastructure</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>VPS · PM2 · GitHub CI</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { label: "Hosting",    value: "Linux VPS (72.60.43.168)" },
                  { label: "Process Mgr", value: "PM2 — zero-downtime restarts" },
                  { label: "Frontend",   value: "PM2 id 35 · Port 3035 · Next.js standalone" },
                  { label: "Backend",    value: "PM2 id 34 · Port 8002 · uvicorn ASGI" },
                  { label: "Deploy",     value: "git push → VPS git pull → pm2 restart" },
                  { label: "Domain",     value: "fincoach.maxevdigital.com (Nginx proxy)" },
                  { label: "Env vars",   value: "ANTHROPIC_API_KEY · OPENAI_API_KEY · DATABASE_URL · REDIS_URL" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: "0.64rem", fontWeight: 700, color: "#0369a1", width: 78, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: "0.64rem", color: DIM }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Tech Stack Visual ──────────────────────────────────────────────── */}
      <section style={{ background: NAVY, color: WHITE, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: LABEL, textTransform: "uppercase", marginBottom: 24 }}>Full Tech Stack</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              {
                category: "Frontend",
                color: GOLD,
                items: [
                  { name: "Next.js 15",             sub: "App Router · Server Components" },
                  { name: "React 19",               sub: "Hooks · Suspense · Streaming" },
                  { name: "TypeScript",             sub: "Strict mode · Type-safe API layer" },
                  { name: "Tailwind CSS",           sub: "Custom navy/gold palette" },
                  { name: "Lucide React",           sub: "Icon system" },
                  { name: "Vitest",                 sub: "Component unit tests" },
                ],
              },
              {
                category: "Backend",
                color: "#0ea5e9",
                items: [
                  { name: "FastAPI",                sub: "Async · OpenAPI docs auto-gen" },
                  { name: "Python 3.11",            sub: "Type hints · Pydantic v2" },
                  { name: "psycopg2",               sub: "PostgreSQL driver" },
                  { name: "redis-py",               sub: "Cache layer" },
                  { name: "uvicorn",                sub: "ASGI server" },
                  { name: "pytest",                 sub: "API endpoint tests" },
                ],
              },
              {
                category: "AI & Data",
                color: "#8b5cf6",
                items: [
                  { name: "Anthropic SDK",          sub: "claude-sonnet-4-6 · streaming" },
                  { name: "OpenAI SDK",             sub: "text-embedding-3-small" },
                  { name: "pgvector",               sub: "1536-dim cosine similarity" },
                  { name: "PostgreSQL 16",          sub: "JSONB · full-text · vectors" },
                  { name: "Redis 7",                sub: "Embedding TTL cache" },
                  { name: "Makefile",               sub: "ingest · seed · migrate" },
                ],
              },
              {
                category: "DevOps",
                color: "#10b981",
                items: [
                  { name: "PM2",                    sub: "Process manager · cluster mode" },
                  { name: "Nginx",                  sub: "Reverse proxy · SSL termination" },
                  { name: "GitHub",                 sub: "Source of truth · CI deploy" },
                  { name: "Let's Encrypt",          sub: "TLS certificates" },
                  { name: "Docker (optional)",      sub: "Containerized local dev" },
                  { name: "Makefile",               sub: "dev · build · deploy · seed" },
                ],
              },
            ].map(({ category, color, items }) => (
              <div key={category} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTop: `3px solid ${color}`, borderRadius: 12, padding: "16px 16px" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{category}</div>
                {items.map(({ name, sub }) => (
                  <div key={name} style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: "0.74rem", fontWeight: 600, color: WHITE }}>{name}</div>
                    <div style={{ fontSize: "0.63rem", color: LABEL }}>{sub}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <a href="https://github.com/maxev-digital/finops-ai-coach" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: WHITE, fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}>
              <Github size={14} />
              View source on GitHub
              <ArrowRight size={11} style={{ opacity: 0.5 }} />
            </a>
            <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: GOLD, borderRadius: 8, color: NAVY, fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" }}>
              <Brain size={14} />
              Try the AI Coach
            </Link>
            <Link href="/insights" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}>
              HR Insights Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function DiagramArrow({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "6px 0" }}>
      <div style={{ width: 1.5, height: 14, background: BORDER }} />
      <div style={{ fontSize: "0.6rem", color: LABEL, padding: "2px 8px", background: SLATE, border: `1px solid ${BORDER}`, borderRadius: 4, margin: "2px 0" }}>{label}</div>
      <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${BORDER}` }} />
    </div>
  );
}
