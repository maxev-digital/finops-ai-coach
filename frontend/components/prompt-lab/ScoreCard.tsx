import { PromptScore } from "@/lib/api";

interface Props {
  label: string;
  scores: PromptScore;
  isWinner: boolean;
}

const DIMS = [
  { key: "relevance", label: "Relevance" },
  { key: "actionability", label: "Actionability" },
  { key: "personalization", label: "Personalization" },
  { key: "safety", label: "Safety" },
] as const;

function ScoreBar({ value }: { value: number }) {
  const color =
    value >= 8 ? "bg-wellness-500" :
    value >= 6 ? "bg-amber-400" :
    "bg-red-400";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-slate-700 w-6 text-right">
        {value}
      </span>
    </div>
  );
}

export default function ScoreCard({ label, scores, isWinner }: Props) {
  return (
    <div className={`card p-6 ${isWinner ? "ring-2 ring-wellness-500" : ""}`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-900">{label}</h3>
        {isWinner && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-wellness-50
                           text-wellness-700 text-xs font-semibold rounded-full border
                           border-wellness-200">
            Winner
          </span>
        )}
      </div>

      <div className="space-y-3 mb-5">
        {DIMS.map((d) => (
          <div key={d.key}>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{d.label}</span>
            </div>
            <ScoreBar value={scores[d.key]} />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Overall</span>
          <span className="text-2xl font-bold text-slate-900">{scores.overall}<span className="text-sm text-slate-400">/10</span></span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{scores.reasoning}</p>
      </div>
    </div>
  );
}
