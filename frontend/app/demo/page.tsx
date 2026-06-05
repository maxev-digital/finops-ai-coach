"use client";

import { useState, useEffect, useRef } from "react";
import { api, User, Source } from "@/lib/api";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import UserSelector from "@/components/chat/UserSelector";
import { Send, Bot, User as UserIcon, BookOpen, Loader2, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export default function DemoPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [promptVersion, setPromptVersion] = useState<"v1" | "v2">("v2");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getUsers().then((us) => {
      setUsers(us);
      if (us.length > 0) setSelectedUser(us[0]);
    }).catch(() => setError("Cannot reach the backend API. Is it running?"));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function switchUser(user: User) {
    setSelectedUser(user);
    setMessages([]);
    setConversationId(undefined);
  }

  async function send() {
    if (!input.trim() || !selectedUser || loading) return;
    const text = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    setError(null);

    try {
      const res = await api.chat(selectedUser.id, text, conversationId, promptVersion);
      setConversationId(res.conversation_id);
      setMessages((m) => [...m, {
        role: "assistant",
        content: res.response,
        sources: res.sources,
      }]);
    } catch (e) {
      setError("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const SUGGESTED = [
    "Should I prioritize my emergency fund or 401(k) contributions?",
    "How do I take full advantage of my employer's HSA?",
    "What's the fastest way to pay off my student loans?",
    "Am I on track to retire comfortably?",
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Financial Wellness Coach</h1>
          <p className="text-slate-500 text-sm mt-1">
            Personalized guidance grounded in your goals, benefits, and financial profile.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Prompt version toggle — subtle, for demo context */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 text-xs">
            {(["v2", "v1"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setPromptVersion(v)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  promptVersion === v
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {v === "v2" ? "Production" : "Baseline"}
              </button>
            ))}
          </div>
          <UserSelector users={users} selected={selectedUser} onChange={switchUser} />
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200
                        text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        {selectedUser && <ProfileSidebar user={selectedUser} />}

        {/* Chat */}
        <div className="flex-1 flex flex-col min-h-[600px]">
          <div className="card flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center
                                  justify-center mb-4">
                    <Bot size={28} className="text-brand-700" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Just Ask Your AI Coach</h3>
                  <p className="text-sm text-slate-500 max-w-sm mb-8">
                    Ask anything about budgeting, retirement, debt, employer benefits, or
                    financial goals.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        onClick={() => { setInput(q); }}
                        className="text-left text-xs text-slate-600 bg-slate-50 hover:bg-slate-100
                                   border border-slate-200 rounded-lg px-3 py-2 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center
                                    justify-center shrink-0 mt-0.5">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${m.role === "user" ? "order-first" : ""}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-brand-700 text-white rounded-tr-sm"
                        : "bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-sm"
                    }`}>
                      {m.content.split("\n").map((line, j) => (
                        <p key={j} className={j > 0 ? "mt-2" : ""}>{line}</p>
                      ))}
                    </div>
                    {m.sources && m.sources.length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs text-slate-400 cursor-pointer
                                           flex items-center gap-1 hover:text-slate-600">
                          <BookOpen size={11} />
                          {m.sources.length} source{m.sources.length !== 1 ? "s" : ""} used
                        </summary>
                        <div className="mt-1 space-y-1">
                          {m.sources.map((s, j) => (
                            <div key={j} className="text-xs text-slate-400 bg-slate-50
                                                    rounded px-2 py-1">
                              {s.document_name.replace(/_/g, " ")} ·{" "}
                              {(s.similarity * 100).toFixed(0)}% match
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center
                                    justify-center shrink-0 mt-0.5">
                      <UserIcon size={16} className="text-slate-600" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center
                                  justify-center shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl
                                  rounded-tl-sm px-4 py-3">
                    <Loader2 size={16} className="text-slate-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Ask your financial wellness question..."
                  disabled={!selectedUser || loading}
                  className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-brand-500
                             disabled:opacity-50 bg-white"
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || !selectedUser || loading}
                  className="px-4 py-2.5 bg-brand-700 text-white rounded-lg hover:bg-brand-800
                             disabled:opacity-40 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                General financial education only — not personalized advice.
                Consult a licensed financial advisor for specific decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
