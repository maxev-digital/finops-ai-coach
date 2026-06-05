"use client";

import { useState, useEffect } from "react";
import { api, User, EvalResponse } from "@/lib/api";
import ScoreCard from "@/components/prompt-lab/ScoreCard";
import UserSelector from "@/components/chat/UserSelector";
import { FlaskConical, Loader2, ArrowRight, AlertCircle } from "lucide-react";

const SAMPLE_QUERIES = [
  "Should I prioritize paying off student loans or contributing to my 401(k)?",
  "How should I think about my employer's HSA benefit?",
  "I'm worried I'm behind on retirement savings. What should I do?",
  "What's the best way to build an emergency fund while paying off debt?",
];

export default function PromptLabPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [query, setQuery] = useState(SAMPLE_QUERIES[0]);
  const [result, setResult] = useState<EvalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getUsers().then((us) => {
      setUsers(us);
      if (us.length > 0) setSelectedUser(us[0]);
    });
  }, []);

  async function runEval() {
    if (!selectedUser || !query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.evaluate(selectedUser.id, query);
      setResult(res);
    } catch {
      setError("Evaluation failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical size={20} className="text-brand-700" />
          <h1 className="text-2xl font-bold text-slate-900">Prompt Engineering Lab</h1>
        </div>
        <p className="text-slate-500 text-sm max-w-2xl">
          Run the same question through two prompt versions and see how engineering
          decisions affect response quality. Claude acts as judge and scores both on
          four dimensions critical to a fiduciary financial product.
        </p>
      </div>

      {/* Config */}
      <div className="card p-6 mb-8">
        <div className="grid md:grid-cols-[1fr,auto] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Question to evaluate
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {SAMPLE_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  className="text-xs text-brand-600 hover:text-brand-800 underline
                             underline-offset-2"
                >
                  {q.substring(0, 45)}…
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 items-end">
            <UserSelector users={users} selected={selectedUser} onChange={setSelectedUser} />
            <button
              onClick={runEval}
              disabled={!selectedUser || !query.trim() || loading}
              className="btn-primary disabled:opacity-40"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Running…</>
              ) : (
                <>Run Comparison <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200
                        text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-20 text-slate-500">
          <Loader2 size={32} className="animate-spin mx-auto mb-4 text-brand-600" />
          <p className="font-medium">Running both prompts + LLM judge…</p>
          <p className="text-sm mt-1">This takes 10-20 seconds</p>
        </div>
      )}

      {result && !loading && (
        <>
          {/* Winner banner */}
          <div className={`rounded-xl px-6 py-4 mb-6 flex items-center justify-between
            ${result.winner === "v2"
              ? "bg-wellness-50 border border-wellness-200"
              : "bg-amber-50 border border-amber-200"}`}>
            <div>
              <span className="font-semibold text-slate-900">
                {result.winner === "v2" ? "Production prompt wins" : "Baseline prompt wins"}
              </span>
              <p className="text-sm text-slate-600 mt-0.5">{result.improvement_summary}</p>
            </div>
            <span className={`text-2xl font-bold ${
              result.winner === "v2" ? "text-wellness-700" : "text-amber-700"
            }`}>
              {result.winner.toUpperCase()}
            </span>
          </div>

          {/* Score cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <ScoreCard
              label="V1 — Baseline Prompt"
              scores={result.v1_scores}
              isWinner={result.winner === "v1"}
            />
            <ScoreCard
              label="V2 — Production Prompt"
              scores={result.v2_scores}
              isWinner={result.winner === "v2"}
            />
          </div>

          {/* Full responses */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "V1 Response — Baseline", text: result.v1_response, dim: true },
              { label: "V2 Response — Production", text: result.v2_response, dim: false },
            ].map(({ label, text, dim }) => (
              <div key={label} className="card p-6">
                <h3 className={`font-semibold mb-3 text-sm ${
                  dim ? "text-slate-500" : "text-slate-900"
                }`}>{label}</h3>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {text}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Explainer */}
      {!result && !loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "V1 — Naive Baseline",
              items: [
                "Minimal system prompt",
                "No user profile context",
                "No structured format",
                "No fiduciary guardrails",
              ],
              accent: "border-slate-200",
            },
            {
              title: "V2 — Production Prompt",
              items: [
                "Fiduciary rules enforced",
                "Full profile + goals injected",
                "Employer benefits surfaced",
                "Structured coaching format",
              ],
              accent: "border-wellness-300",
            },
          ].map((v) => (
            <div key={v.title} className={`card p-6 border-2 ${v.accent}`}>
              <h3 className="font-semibold text-slate-900 mb-3">{v.title}</h3>
              <ul className="space-y-2">
                {v.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
