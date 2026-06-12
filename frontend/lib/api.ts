/**
 * Typed API client for the FastAPI backend.
 *
 * On VPS: requests go to /api/* which nginx proxies to port 8002.
 * Local dev: NEXT_PUBLIC_API_URL=http://localhost:8000
 */

// On VPS: NEXT_PUBLIC_API_URL is unset, nginx proxies /api/* to FastAPI port 8002
// Local dev: NEXT_PUBLIC_API_URL=http://localhost:8000
const BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  user_id: string;
  age: number | null;
  annual_income: number | null;
  risk_tolerance: string;
  has_emergency_fund: boolean;
  emergency_fund_months: number;
  has_retirement_account: boolean;
  total_debt: number;
  monthly_savings: number;
}

export interface Goal {
  id: string;
  user_id: string;
  goal_type: string;
  description: string | null;
  target_amount: number | null;
  current_amount: number;
  target_date: string | null;
  priority: number;
}

export interface Benefit {
  id: string;
  user_id: string;
  employer_name: string | null;
  has_401k: boolean;
  match_percentage: number;
  match_limit_pct_of_salary: number;
  has_hsa: boolean;
  hsa_employer_contribution: number;
  has_espp: boolean;
  espp_discount_pct: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile: Profile | null;
  goals: Goal[];
  benefits: Benefit | null;
}

export interface Source {
  document_name: string;
  content: string;
  similarity: number;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  sources: Source[];
  disclaimer: string;
  domain?: string;   // CFP domain classified by Haiku (e.g. "retirement_savings")
}

export interface WellnessDimension {
  name: string;
  score: number;
  label: string;
  detail: string;
  weight: number;
}

export interface WellnessScore {
  user_id: string;
  overall: number;
  overall_label: string;
  dimensions: WellnessDimension[];
}

export interface PromptScore {
  relevance: number;
  actionability: number;
  personalization: number;
  safety: number;
  overall: number;
  reasoning: string;
}

export interface EvalResponse {
  query: string;
  v1_response: string;
  v2_response: string;
  v1_scores: PromptScore;
  v2_scores: PromptScore;
  winner: string;
  improvement_summary: string;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export const api = {
  getUsers: () => request<User[]>("/profile/users"),

  chat: (userId: string, message: string, conversationId?: string, version = "v2") =>
    request<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        message,
        conversation_id: conversationId ?? null,
        prompt_version: version,
      }),
    }),

  evaluate: (userId: string, query: string) =>
    request<EvalResponse>("/evaluate", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, query }),
    }),

  getWellnessScore: (userId: string) =>
    request<WellnessScore>(`/wellness/${userId}`),
};
