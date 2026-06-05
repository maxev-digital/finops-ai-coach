"use client";

import { User } from "@/lib/api";
import { Target, Building2, TrendingUp, AlertCircle } from "lucide-react";

function pct(current: number, target: number) {
  if (!target) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

function goalLabel(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProfileSidebar({ user }: { user: User }) {
  const p = user.profile;
  const b = user.benefits;

  return (
    <aside className="w-72 shrink-0 space-y-4">
      {/* Profile snapshot */}
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center
                          justify-center text-white font-semibold text-sm">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">{user.name}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
        </div>

        {p && (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Age</dt>
              <dd className="font-medium text-slate-900">{p.age ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Income</dt>
              <dd className="font-medium text-slate-900">
                ${(p.annual_income ?? 0).toLocaleString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Risk Tolerance</dt>
              <dd className="font-medium text-slate-900 capitalize">{p.risk_tolerance}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Emergency Fund</dt>
              <dd className={`font-medium ${p.has_emergency_fund ? "text-wellness-600" : "text-amber-600"}`}>
                {p.has_emergency_fund ? `${p.emergency_fund_months} mo.` : "Not started"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Total Debt</dt>
              <dd className="font-medium text-slate-900">
                ${(p.total_debt ?? 0).toLocaleString()}
              </dd>
            </div>
          </dl>
        )}
      </div>

      {/* Goals */}
      {user.goals.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-brand-700" />
            <span className="section-label">Financial Goals</span>
          </div>
          <div className="space-y-3">
            {user.goals
              .sort((a, b) => a.priority - b.priority)
              .map((g) => {
                const progress = pct(g.current_amount, g.target_amount ?? 0);
                return (
                  <div key={g.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{goalLabel(g.goal_type)}</span>
                      <span className="text-slate-500">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-wellness-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      ${(g.current_amount).toLocaleString()} /{" "}
                      ${(g.target_amount ?? 0).toLocaleString()}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Employer benefits */}
      {b && (
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={14} className="text-brand-700" />
            <span className="section-label">Employer Benefits</span>
          </div>
          <div className="space-y-2 text-sm">
            {b.employer_name && (
              <div className="font-medium text-slate-700 mb-2">{b.employer_name}</div>
            )}
            {b.has_401k && (
              <div className="flex items-start gap-2">
                <TrendingUp size={13} className="text-wellness-600 mt-0.5 shrink-0" />
                <span className="text-slate-600">
                  401(k): {b.match_percentage}% match up to{" "}
                  {b.match_limit_pct_of_salary}% salary
                </span>
              </div>
            )}
            {b.has_hsa && (
              <div className="flex items-start gap-2">
                <TrendingUp size={13} className="text-wellness-600 mt-0.5 shrink-0" />
                <span className="text-slate-600">
                  HSA: employer contributes ${b.hsa_employer_contribution.toLocaleString()}/yr
                </span>
              </div>
            )}
            {b.has_espp && (
              <div className="flex items-start gap-2">
                <TrendingUp size={13} className="text-wellness-600 mt-0.5 shrink-0" />
                <span className="text-slate-600">
                  ESPP: {b.espp_discount_pct}% discount
                </span>
              </div>
            )}
            {!b.has_401k && !b.has_hsa && !b.has_espp && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle size={13} />
                <span className="text-xs">No tax-advantaged accounts</span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
