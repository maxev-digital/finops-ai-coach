"use client";

import { useState, useEffect, useCallback } from "react";
import type { CSSProperties } from "react";
import { api, User } from "@/lib/api";
import { RefreshCw, AlertTriangle, Zap } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function pct(n: number, total: number) {
  return total === 0 ? 0 : Math.round((n / total) * 100);
}

function goalLabel(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function wellnessGrade(score: number) {
  if (score >= 85) return { grade: "A", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" };
  if (score >= 70) return { grade: "B", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" };
  if (score >= 55) return { grade: "C", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" };
  return { grade: "D", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" };
}

// ── SVG Chart Components (light theme) ───────────────────────────────────────

function Gauge({ pct: p, color, label, sub }: { pct: number; color: string; label: string; sub: string }) {
  const r = 50, cx = 65, cy = 64;
  const circumference = Math.PI * r;
  const fill = circumference * Math.min(p, 100) / 100;
  return (
    <div style={{ textAlign: "center" }}>
      <svg viewBox="0 0 130 78" width={130} height={78}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#e2e8f0" strokeWidth={9} strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={`${fill} ${circumference}`} />
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize={20} fontWeight="800" fill="#0d2137">{p}%</text>
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={7.5} fill="#94a3b8" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</text>
      </svg>
      <div style={{ fontSize: "0.68rem", color: "#64748b", marginTop: -6 }}>{sub}</div>
    </div>
  );
}

function Sparkline({ data, color, labels }: { data: number[]; color: string; labels?: string[] }) {
  const W = 185, H = 68;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pad = 10;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (W - 2 * pad),
    y: H - pad - 8 - ((v - min) / range) * (H - 2 * pad - 8),
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${H - pad} L ${pts[0].x.toFixed(1)} ${H - pad} Z`;
  const gradId = `sg${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === data.length - 1 ? 3.5 : 2} fill={color} />
      ))}
      {labels && labels.map((l, i) => (
        <text key={i} x={pts[i].x} y={H - 1} textAnchor="middle" fontSize={7} fill="#94a3b8">{l}</text>
      ))}
    </svg>
  );
}

function Ring({ pct: p, color, center, sub }: { pct: number; color: string; center: string; sub: string }) {
  const r = 38, cx = 50, cy = 50;
  const circumference = 2 * Math.PI * r;
  const fill = circumference * Math.min(p, 100) / 100;
  return (
    <div style={{ textAlign: "center" }}>
      <svg viewBox="0 0 100 100" width={100} height={100}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={9} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={9}
          strokeDasharray={`${fill} ${circumference}`} strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
        />
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize={17} fontWeight="800" fill="#0d2137">{center}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={8} fill="#94a3b8">{sub}</text>
      </svg>
    </div>
  );
}

function DimBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: "0.73rem", color: "#64748b" }}>{label}</span>
        <span style={{ fontSize: "0.73rem", fontWeight: 700, color: "#0d2137" }}>{score}</span>
      </div>
      <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function GoalBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const w = max === 0 ? 0 : Math.round((count / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
      <div style={{ fontSize: "0.7rem", color: "#64748b", width: 130, flexShrink: 0, lineHeight: 1.3 }}>{label}</div>
      <div style={{ flex: 1, height: 7, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 4 }} />
      </div>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0d2137", width: 22, textAlign: "right" }}>{count}</div>
    </div>
  );
}

function MetricTile({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div style={{ padding: "12px 13px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
      <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: "1.15rem", fontWeight: 800, color: alert ? "#ef4444" : "#0d2137" }}>{value}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const TILE_COLORS = ["#f5c842", "#3b82f6", "#10b981", "#8b5cf6", "#f97316", "#06b6d4", "#ec4899"];

export default function InsightsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadData = useCallback(() => {
    setLoading(true);
    api.getUsers()
      .then(setUsers)
      .finally(() => {
        setLoading(false);
        setLastRefresh(new Date());
      });
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5c842", margin: "0 auto 12px", animation: "pulse 1.5s infinite" }} />
        <div style={{ fontSize: "0.9rem" }}>Loading workforce intelligence...</div>
      </div>
    );
  }

  const total = users.length;

  if (total === 0) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
        <div style={{ fontSize: "0.9rem" }}>No employee data found. Run the seed script first.</div>
      </div>
    );
  }

  // ── Aggregations ────────────────────────────────────────────────────────────
  const withEmergencyFund = users.filter((u) => u.profile?.has_emergency_fund).length;
  const withRetirement    = users.filter((u) => u.profile?.has_retirement_account).length;
  const with401k          = users.filter((u) => u.benefits?.has_401k).length;
  const withHsa           = users.filter((u) => u.benefits?.has_hsa).length;
  const withEspp          = users.filter((u) => u.benefits?.has_espp).length;
  const avgDebt    = Math.round(users.reduce((s, u) => s + (u.profile?.total_debt ?? 0), 0) / total);
  const avgSavings = Math.round(users.reduce((s, u) => s + (u.profile?.monthly_savings ?? 0), 0) / total);

  const allGoals       = users.flatMap((u) => u.goals);
  const completedGoals = allGoals.filter((g) => g.target_amount && g.current_amount >= g.target_amount).length;
  const inProgressGoals = allGoals.filter((g) => g.target_amount && g.current_amount > 0 && g.current_amount < g.target_amount).length;

  const goalCounts: Record<string, number> = {};
  users.forEach((u) => u.goals.forEach((g) => { goalCounts[g.goal_type] = (goalCounts[g.goal_type] ?? 0) + 1; }));
  const topGoals    = Object.entries(goalCounts).sort((a, b) => b[1] - a[1]);
  const maxGoalCount = topGoals[0]?.[1] ?? 1;

  // ── Wellness Score ──────────────────────────────────────────────────────────
  const dimResilience  = pct(withEmergencyFund + withRetirement, 2 * total);
  const dimBenefits    = pct(with401k + withHsa + withEspp, 3 * total);
  const dimGoals       = Math.round(pct(completedGoals + inProgressGoals * 0.5, allGoals.length || 1));
  const dimEngagement  = Math.min(100, Math.round(pct(users.filter((u) => u.goals.length > 0).length, total) * 1.1));
  const overallScore   = Math.round(dimResilience * 0.35 + dimBenefits * 0.25 + dimGoals * 0.25 + dimEngagement * 0.15);
  const { grade, color: gradeColor, bg: gradeBg, border: gradeBorder } = wellnessGrade(overallScore);

  const benefitUtil  = Math.round((pct(with401k, total) + pct(withHsa, total) + pct(withEspp, total)) / 3);
  const goalProgress = pct(completedGoals, allGoals.length || 1);
  const noEmergencyFund = total - withEmergencyFund;

  // ── Static trend (demo data; last point = actual score) ─────────────────────
  const wellnessTrend = [62, 65, 68, 66, 71, overallScore];
  const trendLabels   = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  // ── Recommendations ─────────────────────────────────────────────────────────
  type Rec = { level: string; text: string; color: string };
  const recommendations: Rec[] = [];
  if (noEmergencyFund > 0) recommendations.push({ level: "HIGH", text: `${noEmergencyFund} employee${noEmergencyFund !== 1 ? "s" : ""} lack an emergency fund — schedule a financial resilience webinar`, color: "#ef4444" });
  if (benefitUtil < 60)    recommendations.push({ level: "MEDIUM", text: `Benefit utilization at ${benefitUtil}% — send a benefits education campaign to drive 401(k) and HSA enrollment`, color: "#f59e0b" });
  if (dimGoals < 50)       recommendations.push({ level: "MEDIUM", text: "Goal completion rate below 50% — activate FinCoach push notifications for milestone nudges", color: "#f59e0b" });
  if (overallScore >= 70)  recommendations.push({ level: "INFO", text: "Workforce wellness trending positive — consider advanced investment modules for high-engagement employees", color: "#3b82f6" });

  // ── Shared styles ───────────────────────────────────────────────────────────
  const card: CSSProperties = { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 22px" };
  const sectionLabel: CSSProperties = { fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 12 };
  const divider: CSSProperties = { flex: 1, height: 1, background: "#e2e8f0" };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 1.5rem 3rem" }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e88" }} />
            <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0d2137", letterSpacing: "-0.02em" }}>
              Workforce Financial Intelligence
            </h1>
          </div>
          <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 4 }}>
            Aggregated, privacy-safe &nbsp;·&nbsp; {total} enrolled employees &nbsp;·&nbsp; Last refreshed {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <button onClick={loadData} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.75rem", fontWeight: 600, color: "#0d2137", cursor: "pointer" }}>
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* ── Alert Strip ─────────────────────────────────────────────────────── */}
      {recommendations.filter((r) => r.level !== "INFO").slice(0, 2).map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", marginBottom: 8, background: r.color === "#ef4444" ? "#fef2f2" : "#fffbeb", border: `1px solid ${r.color === "#ef4444" ? "#fecaca" : "#fde68a"}`, borderLeft: `3px solid ${r.color}`, borderRadius: 8 }}>
          <AlertTriangle size={13} style={{ color: r.color, flexShrink: 0, marginTop: 1 }} />
          <div>
            <span style={{ fontSize: "0.63rem", fontWeight: 700, color: r.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.level}</span>
            <span style={{ fontSize: "0.78rem", color: "#374151", marginLeft: 8 }}>{r.text}</span>
          </div>
        </div>
      ))}

      <div style={{ marginBottom: recommendations.filter((r) => r.level !== "INFO").length > 0 ? 8 : 0 }} />

      {/* ── 4-Column KPI Row ─────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 14 }}>

        {/* Enrollment Gauge */}
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 12px" }}>
          <div style={{ ...sectionLabel, marginBottom: 8, textAlign: "center" }}>Enrollment Rate</div>
          <Gauge pct={100} color="#f5c842" label="Enrolled" sub="Full demo cohort active" />
        </div>

        {/* Wellness Trend Sparkline */}
        <div style={{ ...card, padding: "16px 16px 12px" }}>
          <div style={{ ...sectionLabel }}>6-Month Wellness Trend</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: "1.55rem", fontWeight: 800, color: "#0d2137" }}>{overallScore}</span>
            <span style={{ fontSize: "0.68rem", color: "#22c55e", fontWeight: 600 }}>+{overallScore - wellnessTrend[0]} pts</span>
          </div>
          <Sparkline data={wellnessTrend} color="#f5c842" labels={trendLabels} />
        </div>

        {/* Goal Progress Ring */}
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 12px" }}>
          <div style={{ ...sectionLabel, marginBottom: 6, textAlign: "center" }}>Goal Progress</div>
          <Ring pct={goalProgress} color="#10b981" center={`${goalProgress}%`} sub="complete" />
          <div style={{ fontSize: "0.66rem", color: "#64748b", textAlign: "center", marginTop: 2 }}>
            {completedGoals} of {allGoals.length} goals reached
          </div>
        </div>

        {/* Benefit Utilization Ring */}
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 12px" }}>
          <div style={{ ...sectionLabel, marginBottom: 6, textAlign: "center" }}>Benefit Utilization</div>
          <Ring pct={benefitUtil} color="#3b82f6" center={`${benefitUtil}%`} sub="avg util." />
          <div style={{ fontSize: "0.66rem", color: "#64748b", textAlign: "center", marginTop: 2 }}>
            401k · HSA · ESPP composite
          </div>
        </div>
      </div>

      {/* ── Goal Topic Map (Portfolio-style heatmap) ─────────────────────────── */}
      <div style={{ ...card, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ ...sectionLabel, marginBottom: 0 }}>Goal Topic Map</span>
          <div style={divider} />
          <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{allGoals.length} active goals · tile size = frequency</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {topGoals.map(([type, count], i) => {
            const size = Math.max(76, Math.round((count / maxGoalCount) * 162));
            return (
              <div key={type} style={{ width: size, height: Math.round(size * 0.62), background: TILE_COLORS[i % TILE_COLORS.length], borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.9 }}>
                <div style={{ fontSize: size > 110 ? "0.78rem" : "0.63rem", fontWeight: 700, color: "#0d2137", textAlign: "center", padding: "0 6px", lineHeight: 1.25 }}>
                  {goalLabel(type)}
                </div>
                <div style={{ fontSize: size > 110 ? "1.15rem" : "0.9rem", fontWeight: 900, color: "#0d2137", marginTop: 2 }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Wellness Grade + Benefits Breakdown ─────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>

        {/* Wellness Score + Grade */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ ...sectionLabel, marginBottom: 0 }}>Workforce Wellness Score</span>
            <div style={divider} />
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 22 }}>
            <div style={{ width: 74, height: 74, borderRadius: 14, background: gradeBg, border: `2px solid ${gradeBorder}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ fontSize: "2.4rem", fontWeight: 900, color: gradeColor, lineHeight: 1 }}>{grade}</div>
              <div style={{ fontSize: "0.58rem", color: gradeColor, fontWeight: 700, marginTop: 2 }}>GRADE</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "3rem", fontWeight: 900, color: "#0d2137", lineHeight: 1 }}>{overallScore}</div>
              <div style={{ fontSize: "0.69rem", color: "#64748b", marginTop: 3 }}>out of 100 · Composite wellness index</div>
              <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
                {overallScore >= 70 && (
                  <span style={{ fontSize: "0.62rem", padding: "2px 7px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 4, fontWeight: 600 }}>Trending Up</span>
                )}
                <span style={{ fontSize: "0.62rem", padding: "2px 7px", background: "#eff6ff", color: "#3b82f6", border: "1px solid #bfdbfe", borderRadius: 4, fontWeight: 600 }}>{total} Employees</span>
              </div>
            </div>
          </div>
          <DimBar label="Financial Resilience" score={dimResilience} color="#10b981" />
          <DimBar label="Benefit Utilization"  score={dimBenefits}   color="#3b82f6" />
          <DimBar label="Goal Progress"         score={dimGoals}      color="#f5c842" />
          <DimBar label="Engagement"            score={dimEngagement} color="#8b5cf6" />
        </div>

        {/* Benefits Breakdown */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ ...sectionLabel, marginBottom: 0 }}>Benefits Utilization Breakdown</span>
            <div style={divider} />
          </div>
          {[
            { label: "401(k) Enrollment", count: with401k,          color: "#f5c842" },
            { label: "HSA Available",      count: withHsa,           color: "#3b82f6" },
            { label: "ESPP Enrolled",      count: withEspp,          color: "#10b981" },
            { label: "Emergency Fund",     count: withEmergencyFund, color: "#8b5cf6" },
            { label: "Retirement Account", count: withRetirement,    color: "#f97316" },
          ].map(({ label, count, color }) => {
            const p2 = pct(count, total);
            return (
              <div key={label} style={{ marginBottom: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.73rem", color: "#374151" }}>{label}</span>
                  <span style={{ fontSize: "0.73rem", fontWeight: 700, color: "#0d2137" }}>
                    {p2}% <span style={{ fontSize: "0.63rem", color: "#94a3b8", fontWeight: 400 }}>({count}/{total})</span>
                  </span>
                </div>
                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${p2}%`, background: color, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
          {/* Stacked composite bar */}
          <div style={{ marginTop: 6, padding: "12px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Benefit Composite (401k · HSA · ESPP)</div>
            <div style={{ display: "flex", gap: 2, height: 12, borderRadius: 6, overflow: "hidden" }}>
              {[pct(with401k, total), pct(withHsa, total), pct(withEspp, total)].map((v, i) => (
                <div key={i} style={{ flex: v || 0.5, background: ["#f5c842", "#3b82f6", "#10b981"][i] }} />
              ))}
              <div style={{ flex: Math.max(0, 100 - pct(with401k, total) - pct(withHsa, total) - pct(withEspp, total)), background: "#e2e8f0" }} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 7 }}>
              {["401k", "HSA", "ESPP"].map((l, i) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: ["#f5c842", "#3b82f6", "#10b981"][i] }} />
                  <span style={{ fontSize: "0.62rem", color: "#64748b" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Financial Profile Grid + Goal Type Breakdown ─────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>

        {/* Financial Profile 3×2 Grid */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ ...sectionLabel, marginBottom: 0 }}>Employee Financial Profile</span>
            <div style={divider} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <MetricTile label="Avg. Monthly Savings" value={`$${avgSavings.toLocaleString()}`} />
            <MetricTile label="Avg. Total Debt"       value={`$${avgDebt.toLocaleString()}`}   alert={avgDebt > 20000} />
            <MetricTile label="Emergency Fund"         value={`${pct(withEmergencyFund, total)}%`} alert={pct(withEmergencyFund, total) < 50} />
            <MetricTile label="Retirement Acct"        value={`${pct(withRetirement, total)}%`} />
            <MetricTile label="Total Enrolled"         value={String(total)} />
            <MetricTile label="At-Risk Employees"      value={String(noEmergencyFund)} alert={noEmergencyFund > 0} />
          </div>
        </div>

        {/* Goal Type Funnel */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ ...sectionLabel, marginBottom: 0 }}>Goal Type Breakdown</span>
            <div style={divider} />
            <span style={{ fontSize: "0.65rem", color: "#94a3b8", flexShrink: 0 }}>{allGoals.length} total</span>
          </div>
          {topGoals.map(([type, count], i) => (
            <GoalBar key={type} label={goalLabel(type)} count={count} max={maxGoalCount} color={TILE_COLORS[i % TILE_COLORS.length]} />
          ))}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", gap: 20 }}>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#10b981" }}>{completedGoals}</div>
              <div style={{ fontSize: "0.59rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Completed</div>
            </div>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#f5c842" }}>{inProgressGoals}</div>
              <div style={{ fontSize: "0.59rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>In Progress</div>
            </div>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#94a3b8" }}>{allGoals.length - completedGoals - inProgressGoals}</div>
              <div style={{ fontSize: "0.59rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Not Started</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recommendations + Vitals Sidebar ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 275px", gap: 12, marginBottom: 14 }}>

        {/* Recommendations panel */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Zap size={12} style={{ color: "#f5c842" }} />
            <span style={{ ...sectionLabel, marginBottom: 0 }}>Proactive Recommendations</span>
            <div style={divider} />
          </div>
          {recommendations.length > 0 ? recommendations.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 12, padding: "12px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: `3px solid ${r.color}`, borderRadius: 8 }}>
              <div style={{ fontSize: "0.63rem", fontWeight: 900, color: r.color, minWidth: 52, paddingTop: 1 }}>{r.level}</div>
              <div style={{ fontSize: "0.82rem", color: "#374151", lineHeight: 1.6 }}>{r.text}</div>
            </div>
          )) : (
            <div style={{ fontSize: "0.82rem", color: "#94a3b8", fontStyle: "italic" }}>All wellness indicators healthy. No urgent actions needed.</div>
          )}

          <div style={{ marginTop: 16, borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
            <div style={{ fontSize: "0.59rem", fontWeight: 700, letterSpacing: "0.12em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 12 }}>FinCoach AI — Active Capabilities</div>
            {[
              { name: "RAG-Powered Coaching",    desc: "Personalized advice grounded in employee benefits and financial profile data" },
              { name: "Fiduciary Guardrails",     desc: "All responses scoped to education — never investment advice or product recommendations" },
              { name: "Benefits Intelligence",    desc: "401k, HSA, ESPP enrollment nudges and deadline alerts sent at the right time" },
              { name: "Goal Milestone Nudges",    desc: "AI-triggered check-ins when employees approach targets or fall behind schedule" },
            ].map(({ name, desc }) => (
              <div key={name} style={{ marginBottom: 11 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#0d2137", marginBottom: 2 }}>{name}</div>
                <div style={{ fontSize: "0.67rem", color: "#94a3b8", lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vitals Sidebar */}
        <div style={card}>
          <div style={{ ...sectionLabel }}>Live Workforce Vitals</div>
          {[
            { label: "Total Enrolled",      value: String(total),                          alert: false },
            { label: "Wellness Score",      value: String(overallScore),                   alert: false },
            { label: "Wellness Grade",      value: grade,                                  alert: false },
            { label: "Goals Active",        value: String(allGoals.length),                alert: false },
            { label: "Goals Complete",      value: String(completedGoals),                 alert: false },
            { label: "In Progress",         value: String(inProgressGoals),                alert: false },
            { label: "No Emergency Fund",   value: String(noEmergencyFund),                alert: noEmergencyFund > 0 },
            { label: "401k Enrolled",       value: `${pct(with401k, total)}%`,             alert: false },
            { label: "Avg. Savings/Mo",     value: `$${avgSavings.toLocaleString()}`,      alert: false },
            { label: "Avg. Total Debt",     value: `$${avgDebt.toLocaleString()}`,         alert: avgDebt > 20000 },
          ].map(({ label, value, alert }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
              <span style={{ fontSize: "0.71rem", color: "#94a3b8" }}>{label}</span>
              <span style={{ fontSize: "1rem", fontWeight: 900, color: alert ? "#ef4444" : "#0d2137" }}>{value}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: "12px 13px", background: "#0d2137", borderRadius: 10 }}>
            <div style={{ fontSize: "0.59rem", fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 9 }}>In Practice, Replaces</div>
            {["Benefits Consultant", "Financial Wellness Vendor", "HR Analytics Platform", "Goal Coaching App", "Engagement Dashboard"].map((r) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#f5c842", flexShrink: 0 }} />
                <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Five Wellness Pillars ────────────────────────────────────────────── */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ ...sectionLabel, marginBottom: 0 }}>The Five Wellness Pillars — FinCoach Approach</span>
          <div style={divider} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {[
            { num: "i.",   title: "Financial Resilience",  body: "Emergency fund readiness, debt-to-income health, and savings trajectory — tracked at the cohort level without exposing individual data.", metric: `${pct(withEmergencyFund, total)}% have emergency fund`, color: "#10b981", alert: pct(withEmergencyFund, total) < 60 },
            { num: "ii.",  title: "Benefits Intelligence",  body: "401k match capture, HSA optimization, ESPP participation — every dollar of compensation actually reaching the employee.", metric: `${benefitUtil}% avg benefit util`, color: "#3b82f6", alert: benefitUtil < 50 },
            { num: "iii.", title: "Goal Coaching",          body: "Personalized milestone nudges for retirement, home purchase, education, and debt payoff goals — grounded in real benefit data.", metric: `${completedGoals} goals completed`, color: "#f5c842", alert: false },
            { num: "iv.",  title: "Fiduciary Guardrails",   body: "Every response scoped to general education. No investment advice. No product recommendations. ERISA-aware design.", metric: "100% guardrail compliance", color: "#8b5cf6", alert: false },
            { num: "v.",   title: "HR Intelligence",        body: "Aggregated, privacy-safe workforce view for HR leadership — no individual data surfaced, only cohort signals for program design.", metric: `${total} employees monitored`, color: "#f97316", alert: false },
          ].map(({ num, title, body: bodyText, metric, color, alert }) => (
            <div key={num} style={{ padding: "15px 13px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 900, color: "#f5c842", marginBottom: 7, fontStyle: "italic" }}>{num}</div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0d2137", marginBottom: 7, lineHeight: 1.3 }}>{title}</div>
              <div style={{ fontSize: "0.69rem", color: "#64748b", lineHeight: 1.55, marginBottom: 10 }}>{bodyText}</div>
              <div style={{ fontSize: "0.69rem", fontWeight: 700, color: alert ? "#ef4444" : color }}>{metric}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
