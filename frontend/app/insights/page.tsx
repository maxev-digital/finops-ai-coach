"use client";

import { useState, useEffect } from "react";
import { api, User } from "@/lib/api";
import { Users, Target, TrendingUp, AlertTriangle, Building2, DollarSign } from "lucide-react";

function goalLabel(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function pct(n: number, total: number) {
  return total === 0 ? 0 : Math.round((n / total) * 100);
}

export default function InsightsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-slate-400">
        Loading workforce insights…
      </div>
    );
  }

  const total = users.length;
  if (total === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-slate-400">
        No employee data found. Run the seed script first.
      </div>
    );
  }

  // Derived aggregations
  const withEmergencyFund = users.filter((u) => u.profile?.has_emergency_fund).length;
  const withRetirement = users.filter((u) => u.profile?.has_retirement_account).length;
  const with401k = users.filter((u) => u.benefits?.has_401k).length;
  const withHsa = users.filter((u) => u.benefits?.has_hsa).length;
  const withEspp = users.filter((u) => u.benefits?.has_espp).length;
  const avgDebt = users.reduce((s, u) => s + (u.profile?.total_debt ?? 0), 0) / total;
  const avgSavings = users.reduce((s, u) => s + (u.profile?.monthly_savings ?? 0), 0) / total;

  // Goal type breakdown
  const goalCounts: Record<string, number> = {};
  users.forEach((u) => u.goals.forEach((g) => {
    goalCounts[g.goal_type] = (goalCounts[g.goal_type] ?? 0) + 1;
  }));
  const topGoals = Object.entries(goalCounts).sort((a, b) => b[1] - a[1]);

  // Goal completion
  const allGoals = users.flatMap((u) => u.goals);
  const completedGoals = allGoals.filter(
    (g) => g.target_amount && g.current_amount >= g.target_amount
  ).length;

  const METRICS = [
    {
      icon: Users,
      label: "Enrolled employees",
      value: total,
      sub: "Demo cohort",
      color: "text-brand-700 bg-brand-50",
    },
    {
      icon: AlertTriangle,
      label: "Without emergency fund",
      value: `${pct(total - withEmergencyFund, total)}%`,
      sub: `${total - withEmergencyFund} of ${total} employees`,
      color: "text-amber-600 bg-amber-50",
    },
    {
      icon: TrendingUp,
      label: "With retirement account",
      value: `${pct(withRetirement, total)}%`,
      sub: `${withRetirement} of ${total} employees`,
      color: "text-wellness-700 bg-wellness-50",
    },
    {
      icon: Target,
      label: "Goal completion rate",
      value: `${pct(completedGoals, allGoals.length)}%`,
      sub: `${completedGoals} of ${allGoals.length} goals reached`,
      color: "text-purple-700 bg-purple-50",
    },
    {
      icon: DollarSign,
      label: "Avg. monthly savings",
      value: `$${Math.round(avgSavings).toLocaleString()}`,
      sub: "Per enrolled employee",
      color: "text-wellness-700 bg-wellness-50",
    },
    {
      icon: DollarSign,
      label: "Avg. total debt",
      value: `$${Math.round(avgDebt).toLocaleString()}`,
      sub: "Per enrolled employee",
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">HR Workforce Insights</h1>
        <p className="text-slate-500 text-sm">
          Aggregated, privacy-safe view of your workforce financial wellness.
          Individual employee data is never surfaced here.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {METRICS.map((m) => (
          <div key={m.label} className="card p-5">
            <div className={`w-9 h-9 rounded-lg ${m.color} flex items-center
                            justify-center mb-3`}>
              <m.icon size={17} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{m.value}</div>
            <div className="text-sm font-medium text-slate-700 mt-0.5">{m.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top financial goals */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-brand-700" />
            <h2 className="font-semibold text-slate-900">Top Financial Goals</h2>
          </div>
          <div className="space-y-3">
            {topGoals.map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{goalLabel(type)}</span>
                  <span className="text-slate-500">{count} employee{count !== 1 ? "s" : ""}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full"
                    style={{ width: `${pct(count, total) * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits utilization */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-brand-700" />
            <h2 className="font-semibold text-slate-900">Benefits Utilization</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "401(k) enrollment", count: with401k, icon: "📈" },
              { label: "HSA available", count: withHsa, icon: "🏥" },
              { label: "ESPP enrolled", count: withEspp, icon: "📊" },
            ].map(({ label, count, icon }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-700">{icon} {label}</span>
                  <span className="font-semibold text-slate-900">
                    {pct(count, total)}%
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-wellness-500 rounded-full transition-all"
                    style={{ width: `${pct(count, total)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gap alert */}
          {total - withEmergencyFund > 0 && (
            <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">Wellness Gap Detected</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {total - withEmergencyFund} employee
                    {total - withEmergencyFund !== 1 ? "s" : ""} lack an emergency fund.
                    Consider promoting financial resilience content.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
