"use client";

import { User } from "@/lib/api";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  users: User[];
  selected: User | null;
  onChange: (user: User) => void;
}

export default function UserSelector({ users, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200
                   rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50
                   transition-colors shadow-sm"
      >
        {selected ? (
          <>
            <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs
                             flex items-center justify-center font-semibold shrink-0">
              {selected.name.split(" ").map((n) => n[0]).join("")}
            </span>
            {selected.name}
          </>
        ) : (
          "Select demo user"
        )}
        <ChevronDown size={14} className="text-slate-400 ml-1" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200
                        rounded-xl shadow-lg z-20 overflow-hidden">
          {users.map((u) => {
            const age = u.profile?.age;
            const goal = u.goals[0]?.goal_type?.replace(/_/g, " ");
            return (
              <button
                key={u.id}
                onClick={() => { onChange(u); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50
                           transition-colors text-left"
              >
                <span className="w-8 h-8 rounded-full bg-brand-700 text-white text-xs
                                 flex items-center justify-center font-semibold shrink-0">
                  {u.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <div className="text-sm font-medium text-slate-900">{u.name}</div>
                  <div className="text-xs text-slate-500">
                    {age ? `Age ${age}` : ""}{age && goal ? " · " : ""}{goal ?? ""}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
