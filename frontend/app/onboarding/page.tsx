"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Brain, ChevronRight, CheckCircle, Loader2 } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const GOALS = [
  { value: "emergency_fund", label: "Build emergency fund" },
  { value: "debt_payoff", label: "Pay off debt" },
  { value: "retirement", label: "Save for retirement" },
  { value: "home_purchase", label: "Buy a home" },
  { value: "wealth_building", label: "Build long-term wealth" },
];

const RISK = [
  { value: "conservative", label: "Conservative — protect what I have" },
  { value: "moderate", label: "Moderate — balanced growth" },
  { value: "aggressive", label: "Aggressive — maximize growth" },
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    age: "",
    annual_income: "",
    emergency_fund_months: "",
    has_emergency_fund: false,
    has_retirement_account: false,
    total_debt: "",
    monthly_savings: "",
    risk_tolerance: "moderate",
    primary_goal: "retirement",
    time_horizon_years: "",
  });

  const [benefits, setBenefits] = useState({
    employer_name: "",
    has_401k: false,
    match_percentage: "",
    has_hsa: false,
    has_espp: false,
  });

  function set<T extends object>(setter: React.Dispatch<React.SetStateAction<T>>, key: keyof T, value: unknown) {
    setter((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!session?.user?.id) return;
    setSaving(true);
    const userId = session.user.id;

    const profilePayload = {
      age: profile.age ? Number(profile.age) : null,
      annual_income: profile.annual_income ? Number(profile.annual_income) : null,
      emergency_fund_months: Number(profile.emergency_fund_months) || 0,
      has_emergency_fund: profile.has_emergency_fund,
      has_retirement_account: profile.has_retirement_account,
      total_debt: Number(profile.total_debt) || 0,
      monthly_savings: Number(profile.monthly_savings) || 0,
      risk_tolerance: profile.risk_tolerance,
      primary_goal: profile.primary_goal,
      time_horizon_years: profile.time_horizon_years ? Number(profile.time_horizon_years) : null,
    };

    const benefitsPayload = {
      employer_name: benefits.employer_name || null,
      has_401k: benefits.has_401k,
      match_percentage: Number(benefits.match_percentage) || 0,
      has_hsa: benefits.has_hsa,
      has_espp: benefits.has_espp,
    };

    await Promise.all([
      fetch(`${BASE}/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      }),
      fetch(`${BASE}/profile/${userId}/benefits`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(benefitsPayload),
      }),
    ]);

    setSaving(false);
    router.push("/demo");
  }

  const stepLabel = ["Your Situation", "Goals & Timeline", "Employer Benefits"];

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain size={22} className="text-navy-900" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-white/50 text-sm">
            Help your AI coach understand your financial picture.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {stepLabel.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={n} className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  done ? "bg-gold-500 text-navy-900" : active ? "bg-gold-500/20 border border-gold-500/60 text-gold-400" : "bg-white/5 border border-white/10 text-white/30"
                }`}>
                  {done ? <CheckCircle size={13} /> : n}
                </div>
                <span className={`text-xs truncate ${active ? "text-white" : done ? "text-white/50" : "text-white/25"}`}>
                  {label}
                </span>
                {i < stepLabel.length - 1 && <div className="flex-1 h-px bg-white/10 min-w-2" />}
              </div>
            );
          })}
        </div>

        <div className="bg-navy-900 border border-white/10 rounded-2xl p-8">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Your financial situation</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Age</label>
                  <input type="number" min="18" max="80" value={profile.age}
                    onChange={(e) => set(setProfile, "age", e.target.value)}
                    className="w-full bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50"
                    placeholder="32" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Annual income ($)</label>
                  <input type="number" min="0" value={profile.annual_income}
                    onChange={(e) => set(setProfile, "annual_income", e.target.value)}
                    className="w-full bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50"
                    placeholder="75000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Total debt ($)</label>
                  <input type="number" min="0" value={profile.total_debt}
                    onChange={(e) => set(setProfile, "total_debt", e.target.value)}
                    className="w-full bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50"
                    placeholder="25000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Monthly savings ($)</label>
                  <input type="number" min="0" value={profile.monthly_savings}
                    onChange={(e) => set(setProfile, "monthly_savings", e.target.value)}
                    className="w-full bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50"
                    placeholder="500" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={profile.has_emergency_fund}
                    onChange={(e) => set(setProfile, "has_emergency_fund", e.target.checked)}
                    className="w-4 h-4 rounded accent-gold-500" />
                  <span className="text-sm text-white/80">I have an emergency fund</span>
                </label>
                {profile.has_emergency_fund && (
                  <div className="ml-7">
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Months of expenses covered</label>
                    <input type="number" min="0" max="24" value={profile.emergency_fund_months}
                      onChange={(e) => set(setProfile, "emergency_fund_months", e.target.value)}
                      className="w-32 bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50"
                      placeholder="3" />
                  </div>
                )}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={profile.has_retirement_account}
                    onChange={(e) => set(setProfile, "has_retirement_account", e.target.checked)}
                    className="w-4 h-4 rounded accent-gold-500" />
                  <span className="text-sm text-white/80">I have a retirement account (401k, IRA, etc.)</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Goals & risk tolerance</h2>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-2">Primary financial goal</label>
                <div className="space-y-2">
                  {GOALS.map((g) => (
                    <label key={g.value} className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                      profile.primary_goal === g.value
                        ? "border-gold-500/50 bg-gold-500/10"
                        : "border-white/10 bg-navy-800/50 hover:border-white/20"
                    }`}>
                      <input type="radio" name="goal" value={g.value} checked={profile.primary_goal === g.value}
                        onChange={() => set(setProfile, "primary_goal", g.value)}
                        className="accent-gold-500" />
                      <span className="text-sm text-white">{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-2">Risk tolerance</label>
                <div className="space-y-2">
                  {RISK.map((r) => (
                    <label key={r.value} className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                      profile.risk_tolerance === r.value
                        ? "border-gold-500/50 bg-gold-500/10"
                        : "border-white/10 bg-navy-800/50 hover:border-white/20"
                    }`}>
                      <input type="radio" name="risk" value={r.value} checked={profile.risk_tolerance === r.value}
                        onChange={() => set(setProfile, "risk_tolerance", r.value)}
                        className="accent-gold-500" />
                      <span className="text-sm text-white">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Time horizon (years)</label>
                <input type="number" min="1" max="40" value={profile.time_horizon_years}
                  onChange={(e) => set(setProfile, "time_horizon_years", e.target.value)}
                  className="w-32 bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50"
                  placeholder="20" />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Employer benefits</h2>
              <p className="text-xs text-white/40">
                This helps your coach surface unutilized benefits in every conversation.
              </p>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Employer name (optional)</label>
                <input type="text" value={benefits.employer_name}
                  onChange={(e) => set(setBenefits, "employer_name", e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50"
                  placeholder="Acme Corp" />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={benefits.has_401k}
                    onChange={(e) => set(setBenefits, "has_401k", e.target.checked)}
                    className="w-4 h-4 rounded accent-gold-500" />
                  <span className="text-sm text-white/80">Employer offers 401(k) with match</span>
                </label>
                {benefits.has_401k && (
                  <div className="ml-7">
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Match percentage (%)</label>
                    <input type="number" min="0" max="100" value={benefits.match_percentage}
                      onChange={(e) => set(setBenefits, "match_percentage", e.target.value)}
                      className="w-28 bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50"
                      placeholder="4" />
                  </div>
                )}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={benefits.has_hsa}
                    onChange={(e) => set(setBenefits, "has_hsa", e.target.checked)}
                    className="w-4 h-4 rounded accent-gold-500" />
                  <span className="text-sm text-white/80">HSA-eligible health plan</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={benefits.has_espp}
                    onChange={(e) => set(setBenefits, "has_espp", e.target.checked)}
                    className="w-4 h-4 rounded accent-gold-500" />
                  <span className="text-sm text-white/80">Employee Stock Purchase Plan (ESPP)</span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {step > 1 ? (
              <button onClick={() => setStep((s) => s - 1)}
                className="text-sm text-white/50 hover:text-white transition-colors">
                Back
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg px-5 py-2.5 text-sm transition-colors">
                Continue <ChevronRight size={15} />
              </button>
            ) : (
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-navy-900 font-bold rounded-lg px-5 py-2.5 text-sm transition-colors">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? "Saving..." : "Start Coaching"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          You can update all of this later from the coach settings.
        </p>
      </div>
    </div>
  );
}
