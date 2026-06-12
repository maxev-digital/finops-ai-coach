import type { Metadata } from "next";
import Link from "next/link";
import {
  Brain, Database, Cpu, Globe, ArrowRight, Github, ExternalLink,
  Layers, Zap, Shield, Server, Lock, CheckCircle, GitBranch,
} from "lucide-react";

export const metadata: Metadata = {
  title: "System Architecture — FinCoach AI",
  description:
    "Full-stack RAG pipeline architecture: 3-tier model routing, 82-document knowledge base, personalization pipeline, multi-vertical template system.",
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
  { title: "Frontend Layer",    sub: "Next.js 15 App Router · React · Tailwind CSS · TypeScript",            color: "#f5c842", bg: "#fffbeb", border: "#fde68a" },
  { title: "API Layer",         sub: "FastAPI · Python 3.11 · Pydantic · Async I/O",                         color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { title: "Intelligence Layer",sub: "3-Tier Model Routing · Domain Classification · Async Evaluation",       color: "#a855f7", bg: "#fdf4ff", border: "#e9d5ff" },
  { title: "Personalization",   sub: "6-Category User Profile · Context Injection · Wellness Score",          color: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
  { title: "Data Layer",        sub: "PostgreSQL + pgvector · Redis Cache · 82 docs · 1,133 chunks",          color: "#10b981", bg: "#f0fdf4", border: "#a7f3d0" },
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
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Phase 2 — Full-Stack RAG Architecture</span>
            </div>
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.1 }}>
            System Architecture
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", maxWidth: 680, lineHeight: 1.7, marginBottom: 16 }}>
            A production-quality generative overlay — 3-tier model routing, 1,133-chunk grounded knowledge base,
            full user profile personalization, and a cross-model evaluation layer. Built to mirror BrightPlan&apos;s
            &ldquo;Just Ask&rdquo; architecture at production depth.
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
            {[
              { label: "Knowledge Base", val: "82 docs / 1,133 chunks", color: "#a7f3d0" },
              { label: "CFP Domains",    val: "15 domains covered",      color: "#bae6fd" },
              { label: "Model Tiers",    val: "Haiku → Sonnet → Opus",  color: "#e9d5ff" },
              { label: "Eval Dimensions",val: "4 scored dimensions",     color: "#fed7aa" },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color }}>{val}</div>
              </div>
            ))}
          </div>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
            {LAYERS.map((l) => (
              <div key={l.title} style={{ background: l.bg, border: `1px solid ${l.border}`, borderLeft: `4px solid ${l.color}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: l.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{l.title}</div>
                <div style={{ fontSize: "0.64rem", color: DIM, lineHeight: 1.5 }}>{l.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Diagram ───────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: LABEL, textTransform: "uppercase", marginBottom: 20 }}>System Diagram</div>

          {/* Browser */}
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "#f1f5f9", border: `1px solid ${BORDER}`, borderRadius: 10 }}>
              <Globe size={16} style={{ color: DIM }} />
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: NAVY }}>Browser / HR Admin</span>
            </div>
          </div>
          <DiagramArrow label="HTTPS · Port 3035" />

          {/* Frontend */}
          <div style={{ background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 14, padding: "16px 20px", marginBottom: 8 }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Frontend — Next.js 15 App Router</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {[
                { path: "/",             label: "Landing",      desc: "Multi-vertical showcase" },
                { path: "/demo",         label: "AI Coach",     desc: "Streaming chat + history" },
                { path: "/prompt-lab",   label: "Prompt Lab",   desc: "V1 vs V2 · Opus judge" },
                { path: "/insights",     label: "HR Insights",  desc: "Wellness dashboard" },
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
          <DiagramArrow label="REST API · Port 8002 (nginx proxy)" />

          {/* API */}
          <div style={{ background: "#f0f9ff", border: "2px solid #bae6fd", borderRadius: 14, padding: "16px 20px", marginBottom: 8 }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>API Layer — FastAPI (Python 3.11)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {[
                { path: "POST /chat",    label: "Chat",      desc: "RAG query · streaming" },
                { path: "GET /users",    label: "Users",     desc: "Profiles + goals + benefits" },
                { path: "POST /evaluate",label: "Evaluate",  desc: "V1 vs V2 · Opus judge" },
                { path: "GET /health",   label: "Health",    desc: "DB + Redis connectivity" },
                { path: "POST /ingest",  label: "Ingest",    desc: "Chunk + embed + upsert" },
              ].map((p) => (
                <div key={p.path} style={{ background: WHITE, border: "1px solid #bae6fd", borderRadius: 8, padding: "10px 10px" }}>
                  <div style={{ fontSize: "0.61rem", color: "#0369a1", fontWeight: 700, marginBottom: 3 }}>{p.path}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: NAVY, marginBottom: 2 }}>{p.label}</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <DiagramArrow label="External API calls (Anthropic SDK + OpenAI SDK)" />

          {/* 3-Tier Model Routing */}
          <div style={{ background: "#fdf4ff", border: "2px solid #e9d5ff", borderRadius: 14, padding: "16px 20px", marginBottom: 8 }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#7e22ce", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Intelligence Layer — 3-Tier Model Routing</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                {
                  step: "1", tag: "CLASSIFY", model: "claude-haiku-4-5-20251001",
                  label: "Domain Classifier", latency: "< 100ms",
                  desc: "Determines which CFP domain(s) the query touches. Drives targeted vector retrieval. Pure routing — no generation.",
                  color: "#06b6d4", border: "#a5f3fc", bg: "#ecfeff",
                },
                {
                  step: "2", tag: "GENERATE", model: "claude-sonnet-4-6",
                  label: "Hot-Path Generator", latency: "Streaming",
                  desc: "Profile snapshot + retrieved chunks + query → streaming response. Grounded RAG minimizes quality delta vs Opus on the hot path.",
                  color: "#8b5cf6", border: "#ddd6fe", bg: "#faf5ff",
                },
                {
                  step: "3", tag: "EVALUATE", model: "claude-opus-4-8",
                  label: "Async Quality Judge", latency: "Async (post-stream)",
                  desc: "Cross-model eval: Opus runs AFTER Sonnet response is delivered. Scores personalization, grounding, actionability, safety.",
                  color: "#f97316", border: "#fed7aa", bg: "#fff7ed",
                },
              ].map(({ step, tag, model, label, latency, desc, color, border, bg }) => (
                <div key={step} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 14px" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 900, color: WHITE, flexShrink: 0 }}>{step}</div>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{tag}</div>
                    <div style={{ marginLeft: "auto", fontSize: "0.58rem", padding: "2px 6px", background: WHITE, border: `1px solid ${border}`, borderRadius: 4, color: DIM, fontWeight: 600 }}>{latency}</div>
                  </div>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: NAVY, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: "0.61rem", color: color, fontWeight: 600, fontFamily: "monospace", marginBottom: 6 }}>{model}</div>
                  <div style={{ fontSize: "0.64rem", color: DIM, lineHeight: 1.55 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
          <DiagramArrow label="pgvector cosine similarity search + Redis embedding cache" />

          {/* Data layer */}
          <div style={{ background: "#f0fdf4", border: "2px solid #a7f3d0", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Data Layer — PostgreSQL 16 + pgvector 0.8.2 + Redis</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { label: "document_chunks",    sub: "82 docs · 1,133 chunks · vector(1536)",              desc: "Cosine similarity via <=> operator. Raw SQL — no LangChain abstraction." },
                { label: "users + profiles",   sub: "Financial profiles · goals · benefits",               desc: "6-category intake: identity, income, assets, liabilities, goals, risk+tax." },
                { label: "chat_sessions",      sub: "Full conversation history",                            desc: "JSONB messages array, session_id, timestamps. Preserved across tabs." },
                { label: "Redis Cache",        sub: "Embedding memoization · 1hr TTL",                     desc: "SHA-256(query) → vector. Eliminates repeat OpenAI embedding calls." },
              ].map(({ label, sub, desc }) => (
                <div key={label} style={{ background: WHITE, border: "1px solid #a7f3d0", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#065f46", fontFamily: "monospace", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: "0.61rem", color: "#10b981", fontWeight: 600, marginBottom: 5 }}>{sub}</div>
                  <div style={{ fontSize: "0.62rem", color: DIM, lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Query Pipeline Steps ───────────────────────────────────────────── */}
      <section style={{ background: SLATE, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: LABEL, textTransform: "uppercase", marginBottom: 6 }}>Coaching Query — Request Trace</div>
          <p style={{ fontSize: "0.78rem", color: DIM, marginBottom: 24 }}>What happens when an employee asks &ldquo;How should I allocate my 401k match?&rdquo;</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { step: "1", title: "User submits question",   body: "Employee types a question in the AI Coach chat. Next.js sends POST to FastAPI /chat with question + user_id.", layer: "Frontend",   color: "#f5c842", border: "#fde68a", bg: "#fffbeb" },
              { step: "2", title: "Domain classification",   body: "Haiku (< 100ms) classifies the query domain — retirement, tax, estate, etc. Result drives targeted pgvector retrieval and retrieval depth.", layer: "Haiku",      color: "#06b6d4", border: "#a5f3fc", bg: "#ecfeff" },
              { step: "3", title: "Profile snapshot built",  body: "6-category user profile assembled: age/filing status, income, assets by tax bucket, liabilities, goals, risk tolerance. Prepended to system prompt.", layer: "API",        color: "#f97316", border: "#fed7aa", bg: "#fff7ed" },
              { step: "4", title: "Vector similarity search",body: "pgvector cosine search on the user's embedded query against 1,133 chunks across 15 CFP domains. Top-k retrieved, filtered by domain from step 2.", layer: "pgvector",   color: "#10b981", border: "#a7f3d0", bg: "#f0fdf4" },
              { step: "5", title: "RAG prompt assembled",    body: "System guardrails + user context block + top-k chunks + original question. Profile snapshot ensures every answer references the user's actual numbers.", layer: "API",        color: "#0ea5e9", border: "#bae6fd", bg: "#f0f9ff" },
              { step: "6", title: "Sonnet streams response", body: "claude-sonnet-4-6 streams the grounded answer back to the browser. User sees text appear in real time. Response is grounded in retrieved source docs.", layer: "Sonnet",     color: "#8b5cf6", border: "#ddd6fe", bg: "#faf5ff" },
              { step: "7", title: "Opus evaluates async",    body: "claude-opus-4-8 runs AFTER the response is delivered — user doesn't wait. Scores 4 dimensions: personalization, grounding, actionability, safety. Results saved to DB.", layer: "Opus (async)",color: "#f97316", border: "#fed7aa", bg: "#fff7ed" },
              { step: "8", title: "Response + history saved",body: "Full exchange stored in chat_sessions as JSONB. Session ID returned to client for follow-up continuity. Eval scores stored for Prompt Lab analysis.", layer: "Data Layer",  color: "#10b981", border: "#a7f3d0", bg: "#f0fdf4" },
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

      {/* ── Knowledge Base ────────────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: LABEL, textTransform: "uppercase", marginBottom: 6 }}>Knowledge Base — 15 CFP Domains</div>
          <p style={{ fontSize: "0.78rem", color: DIM, marginBottom: 20 }}>82 markdown documents ingested into pgvector as 1,133 chunks (chunk_size=800, overlap=100, RecursiveCharacterTextSplitter).</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {[
              { domain: "Tax Planning",        docs: 8,  color: "#ef4444", bg: "#fef2f2", border: "#fecaca", topics: "Brackets · Roth conversion · cap gains · QBI · IRMAA · TLH · SALT" },
              { domain: "Retirement Savings",  docs: 7,  color: "#f97316", bg: "#fff7ed", border: "#fed7aa", topics: "401k/403b · IRA · Roth · SEP/SIMPLE/Solo · RMD (SECURE 2.0) · 72(t)" },
              { domain: "Retirement Income",   docs: 6,  color: "#eab308", bg: "#fefce8", border: "#fef08a", topics: "SS optimization · 4% rule · withdrawal order · sequence-of-returns · bucket" },
              { domain: "Investment Planning", docs: 7,  color: "#84cc16", bg: "#f7fee7", border: "#d9f99d", topics: "Asset allocation · passive/active · factor · TLH · asset location · bond ladder" },
              { domain: "Estate Planning",     docs: 7,  color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", topics: "Will vs trust · ILIT · GRAT · beneficiaries · gifting · exemption sunset" },
              { domain: "Insurance & Risk",    docs: 5,  color: "#06b6d4", bg: "#ecfeff", border: "#a5f3fc", topics: "Term vs perm · disability (own-occ) · LTC hybrid · umbrella · buy-sell" },
              { domain: "Healthcare",          docs: 5,  color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", topics: "Medicare A/B/C/D · Medigap · IRMAA · HSA triple tax · ACA subsidy cliff" },
              { domain: "Education Funding",   docs: 4,  color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", topics: "529 superfunding · Coverdell · UGMA/UTMA · FAFSA · SECURE 2.0 529→Roth" },
              { domain: "Debt Strategy",       docs: 4,  color: "#8b5cf6", bg: "#faf5ff", border: "#ddd6fe", topics: "Mortgage refi · student loan IDR/PSLF · avalanche/snowball · HELOC" },
              { domain: "Business Owner",      docs: 5,  color: "#a855f7", bg: "#fdf4ff", border: "#e9d5ff", topics: "S-Corp vs LLC · Solo 401k vs SEP · QBI · succession · key person insurance" },
              { domain: "Equity Compensation", docs: 4,  color: "#ec4899", bg: "#fdf2f8", border: "#fbcfe8", topics: "RSU taxation · ISO vs NSO AMT · ESPP · 83(b) election · concentrated stock" },
              { domain: "Behavioral Finance",  docs: 3,  color: "#f43f5e", bg: "#fff1f2", border: "#fecdd3", topics: "Loss aversion · recency bias · DCA as behavior management" },
              { domain: "Life Stage",          docs: 5,  color: "#10b981", bg: "#f0fdf4", border: "#a7f3d0", topics: "New grad · marriage · new parent · pre-retirement Roth window · transition" },
              { domain: "Government Benefits", docs: 3,  color: "#14b8a6", bg: "#f0fdfa", border: "#99f6e4", topics: "SS COLA history · FRA by birth year · Medicare enrollment windows" },
              { domain: "IRS Reference Data",  docs: 4,  color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", topics: "2025 contribution limits · all-filing-status brackets · cap gains thresholds" },
            ].map(({ domain, docs, color, bg, border, topics }) => (
              <div key={domain} style={{ background: bg, border: `1px solid ${border}`, borderLeft: `3px solid ${color}`, borderRadius: 8, padding: "12px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: NAVY, lineHeight: 1.3, flex: 1, marginRight: 6 }}>{domain}</div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 800, color, flexShrink: 0, background: WHITE, border: `1px solid ${border}`, borderRadius: 4, padding: "1px 5px" }}>{docs} docs</div>
                </div>
                <div style={{ fontSize: "0.6rem", color: DIM, lineHeight: 1.5 }}>{topics}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Component Deep-Dive ────────────────────────────────────────────── */}
      <section style={{ background: SLATE, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: LABEL, textTransform: "uppercase", marginBottom: 24 }}>Component Deep-Dive</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>

            {/* RAG Pipeline */}
            <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
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
                Documents chunked at ingest time and stored as pgvector embeddings. Query embedding retrieved from Redis (or generated via OpenAI), then cosine searched against 1,133 chunks. Top-k injected into Claude prompt as grounding context.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {["Chunk size: 800 tokens", "Chunk overlap: 100 tokens", "Top-k retrieval: 5 chunks", "Similarity metric: cosine (<=>)", "Embedding dim: 1536 (text-embedding-3-small)", "Knowledge base: 82 docs / 1,133 chunks"].map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#8b5cf6", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.68rem", color: DIM }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Model Routing */}
            <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#fdf4ff", border: "1px solid #e9d5ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GitBranch size={15} style={{ color: "#a855f7" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>Multi-Model Routing</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>Right model for each task tier</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                {[
                  { model: "Haiku", tier: "Classify", why: "Domain routing is a classification task. Sub-100ms, minimal tokens. Using Opus here wastes 10x cost on a binary decision.", color: "#06b6d4" },
                  { model: "Sonnet", tier: "Generate (hot path)", why: "Streams 2–3x faster than Opus. Grounded RAG quality near-equal because retrieval does the heavy lifting, not the model.", color: "#8b5cf6" },
                  { model: "Opus", tier: "Evaluate (async)", why: "Cross-model eval: Opus catching Sonnet's errors has genuine independence. Same-model eval shares blindspots. Runs after stream — user never waits.", color: "#f97316" },
                ].map(({ model, tier, why, color }) => (
                  <div key={model} style={{ padding: "10px 12px", background: SLATE, border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 800, color }}>{model}</span>
                      <span style={{ fontSize: "0.6rem", color: DIM }}>— {tier}</span>
                    </div>
                    <div style={{ fontSize: "0.63rem", color: DIM, lineHeight: 1.5 }}>{why}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "0.63rem", color: DIM, fontStyle: "italic" }}>Future: add third-vendor judge (Gemini / GPT-4o) for vendor-diversity.</div>
            </div>

            {/* Personalization */}
            <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle size={15} style={{ color: "#f97316" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>User Personalization</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>6-category profile injection</div>
                </div>
              </div>
              <div style={{ fontSize: "0.7rem", color: DIM, lineHeight: 1.65, marginBottom: 12 }}>
                Every request builds a structured user context block prepended to the system prompt — not just when the user asks something profile-specific.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                {["Identity: age, state, filing status, dependents", "Income: W-2, SE, rental, investment, SS, pension", "Assets: tax-deferred / Roth / taxable / real estate", "Liabilities: mortgage, student loans, credit, other", "Goals: retirement target, education, home purchase", "Risk + Tax: tolerance, bracket, state tax, equity comp"].map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f97316", flexShrink: 0, marginTop: 5 }} />
                    <span style={{ fontSize: "0.66rem", color: DIM }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "8px 10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: "0.62rem", color: "#475569", fontFamily: "monospace", lineHeight: 1.55 }}>
                52yo · MFJ · Texas · $217K HH<br />
                Assets: $680K 401k · $45K Roth · $120K taxable<br />
                Goal: retire 62 @ $8K/mo · bracket: 24%
              </div>
            </div>

            {/* Fiduciary Guardrails */}
            <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#f0fdf4", border: "1px solid #a7f3d0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield size={15} style={{ color: "#10b981" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>Fiduciary Guardrails</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>Compliance-first prompt design</div>
                </div>
              </div>
              <div style={{ fontSize: "0.7rem", color: DIM, lineHeight: 1.65, marginBottom: 14 }}>
                Every Claude prompt includes a system instruction scoping responses to general financial wellness education only. The model is explicitly instructed to decline investment advice, product recommendations, and tax guidance — all requiring licensure.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {["No specific investment recommendations", "No product endorsements", "No tax or legal advice", "ERISA-awareness baked into prompts", "Source citations for every claim", "Opus evaluates safety on every async pass"].map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.68rem", color: DIM }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt Engineering */}
            <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#faf5ff", border: "1px solid #ddd6fe", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={15} style={{ color: "#8b5cf6" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>Prompt Engineering Lab</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>V1 naive vs V2 production</div>
                </div>
              </div>
              <div style={{ fontSize: "0.7rem", color: DIM, lineHeight: 1.65, marginBottom: 12 }}>
                V1 intentionally naive, V2 production-grade. The gap between them is the demo&apos;s core argument: prompt engineering is measurable. Opus judges both, scoring 4 dimensions with specific reasoning citing the user&apos;s actual data.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Relevance",        desc: "Does the response address the user's actual question?" },
                  { label: "Actionability",    desc: "Is there a concrete next step the user can take?" },
                  { label: "Personalization",  desc: "Does it reference the user's specific numbers?" },
                  { label: "Safety",           desc: "Does it stay within wellness coaching scope?" },
                ].map(({ label, desc }) => (
                  <div key={label} style={{ padding: "7px 10px", background: SLATE, border: "1px solid #ddd6fe", borderRadius: 6 }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6d28d9" }}>{label}</div>
                    <div style={{ fontSize: "0.62rem", color: DIM }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure */}
            <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Server size={15} style={{ color: "#0ea5e9" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>Infrastructure</div>
                  <div style={{ fontSize: "0.62rem", color: DIM }}>VPS · PM2 · GitHub Actions CI</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { label: "Hosting",      value: "Linux VPS (72.60.43.168)" },
                  { label: "Process Mgr",  value: "PM2 — zero-downtime restarts" },
                  { label: "Frontend",     value: "PM2 port 3035 · Next.js standalone" },
                  { label: "Backend",      value: "PM2 port 8002 · uvicorn ASGI" },
                  { label: "DB",           value: "Docker finops-coach-db · port 5445" },
                  { label: "Deploy",       value: "git push → VPS git pull → deploy.sh" },
                  { label: "Domain",       value: "fincoach.maxevdigital.com (Nginx + SSL)" },
                  { label: "CI",           value: "GitHub Actions · pytest + vitest green" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: "0.64rem", fontWeight: 700, color: "#0369a1", width: 82, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: "0.64rem", color: DIM }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Multi-Vertical Template System ────────────────────────────────── */}
      <section style={{ background: WHITE, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: LABEL, textTransform: "uppercase", marginBottom: 6 }}>Multi-Vertical Template System</div>
          <p style={{ fontSize: "0.78rem", color: DIM, marginBottom: 20 }}>The RAG pipeline is vertical-agnostic. Swap the knowledge base and guardrails, launch a new advisor in any domain.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
            {[
              {
                label: "Financial Advisor", status: "LIVE", statusColor: "#10b981", statusBg: "#f0fdf4", statusBorder: "#a7f3d0",
                color: GOLD, bg: "#fffbeb", border: "#fde68a",
                desc: "Full BrightPlan demo — personalization, 3-tier routing, 82-doc KB, Opus eval.",
              },
              {
                label: "Healthcare Benefits", status: "LOCKED", statusColor: "#94a3b8", statusBg: "#f8fafc", statusBorder: "#e2e8f0",
                color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd",
                desc: "HR benefits navigation, FSA/HSA optimization, plan comparison, enrollment windows.",
              },
              {
                label: "Real Estate Advisor", status: "LOCKED", statusColor: "#94a3b8", statusBg: "#f8fafc", statusBorder: "#e2e8f0",
                color: "#10b981", bg: "#f0fdf4", border: "#a7f3d0",
                desc: "Buy vs rent math, mortgage optimization, 1031 exchange, rental property analysis.",
              },
              {
                label: "Legal Self-Help", status: "LOCKED", statusColor: "#94a3b8", statusBg: "#f8fafc", statusBorder: "#e2e8f0",
                color: "#8b5cf6", bg: "#faf5ff", border: "#ddd6fe",
                desc: "Contract basics, employment law, tenant rights, small business legal fundamentals.",
              },
              {
                label: "HR Benefits Coach", status: "LOCKED", statusColor: "#94a3b8", statusBg: "#f8fafc", statusBorder: "#e2e8f0",
                color: "#f97316", bg: "#fff7ed", border: "#fed7aa",
                desc: "Total comp optimization, equity comp, 401k matching strategies, benefits enrollment.",
              },
            ].map(({ label, status, statusColor, statusBg, statusBorder, color, bg, border, desc }) => (
              <div key={label} style={{ background: bg, border: `2px solid ${border}`, borderRadius: 12, padding: "16px 14px", position: "relative", opacity: status === "LOCKED" ? 0.7 : 1 }}>
                {status === "LOCKED" && (
                  <div style={{ position: "absolute", top: 10, right: 10 }}>
                    <Lock size={12} style={{ color: "#94a3b8" }} />
                  </div>
                )}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: 4, marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: statusColor }} />
                  <span style={{ fontSize: "0.58rem", fontWeight: 700, color: statusColor }}>{status}</span>
                </div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: "0.64rem", color: DIM, lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
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
                  { name: "Next.js 15",         sub: "App Router · Server Components" },
                  { name: "React 19",            sub: "Hooks · Suspense · Streaming" },
                  { name: "TypeScript",          sub: "Strict mode · Type-safe API layer" },
                  { name: "Tailwind CSS",        sub: "Custom navy/gold palette" },
                  { name: "Lucide React",        sub: "Icon system" },
                  { name: "Vitest",              sub: "Component unit tests" },
                ],
              },
              {
                category: "Backend",
                color: "#0ea5e9",
                items: [
                  { name: "FastAPI",             sub: "Async · OpenAPI docs auto-gen" },
                  { name: "Python 3.11",         sub: "Type hints · Pydantic v2" },
                  { name: "SQLAlchemy async",    sub: "AsyncSession + asyncpg driver" },
                  { name: "redis-py",            sub: "Embedding cache layer" },
                  { name: "uvicorn",             sub: "ASGI server" },
                  { name: "pytest",              sub: "API tests — all paid APIs mocked" },
                ],
              },
              {
                category: "AI & Data",
                color: "#a855f7",
                items: [
                  { name: "Haiku 4.5",           sub: "Domain classification" },
                  { name: "Sonnet 4.6",          sub: "Hot-path RAG generation" },
                  { name: "Opus 4.8",            sub: "Async cross-model evaluation" },
                  { name: "text-embedding-3-small", sub: "1536-dim OpenAI vectors" },
                  { name: "PostgreSQL 16 + pgvector", sub: "Cosine search · raw SQL" },
                  { name: "Redis 7",             sub: "Embedding TTL cache" },
                ],
              },
              {
                category: "DevOps",
                color: "#10b981",
                items: [
                  { name: "PM2",                 sub: "Process manager · cluster mode" },
                  { name: "Nginx",               sub: "Reverse proxy · SSL termination" },
                  { name: "GitHub Actions",      sub: "CI on PR to develop / main" },
                  { name: "Docker",              sub: "finops-coach-db (pgvector container)" },
                  { name: "Let's Encrypt",       sub: "TLS certificates" },
                  { name: "Makefile",            sub: "dev · build · deploy · seed · ingest" },
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
            <Link href="/prompt-lab" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}>
              Prompt Lab
            </Link>
            <Link href="/insights" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}>
              HR Insights
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
