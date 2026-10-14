import type { MatchScore } from "@/lib/admin/matchmaking-types";

function scoreColor(pct: number): string {
  if (pct >= 75) return "text-[#16815D]";
  if (pct >= 50) return "text-[#B7791F]";
  return "text-[#C63B4E]";
}

function ringBg(pct: number): string {
  if (pct >= 75) return "bg-[#ECFDF5] border-[#A7F3D0]";
  if (pct >= 50) return "bg-[#FFFBEB] border-[#FDE68A]";
  return "bg-[#FFF1F2] border-[#FECDD3]";
}

interface Props {
  score: Pick<MatchScore, "forward_percentage" | "reverse_percentage" | "overall_percentage">;
  /** e.g. "Sarah → Daniel" */
  forwardLabel?: string;
  reverseLabel?: string;
  size?: "sm" | "lg";
}

/** Always shows forward + reverse + overall — never a single percentage. */
export function CompatibilityScore({
  score,
  forwardLabel = "Requester → Candidate",
  reverseLabel = "Candidate → Requester",
  size = "lg",
}: Props) {
  const overallDims = size === "lg" ? "h-20 w-20" : "h-12 w-12";
  const overallText = size === "lg" ? "text-2xl" : "text-base";

  return (
    <div className="flex flex-col items-center">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2">
        Compatibility
      </p>
      <div
        className={`${overallDims} rounded-full border-2 flex items-center justify-center ${ringBg(score.overall_percentage)}`}
      >
        <span className={`${overallText} font-bold tabular-nums ${scoreColor(score.overall_percentage)}`}>
          {score.overall_percentage}%
        </span>
      </div>
      <p className="mt-1 text-xs text-[#666672]">Overall</p>

      <div className="mt-4 flex items-start gap-8">
        <Direction label={forwardLabel} pct={score.forward_percentage} />
        <Direction label={reverseLabel} pct={score.reverse_percentage} />
      </div>
    </div>
  );
}

function Direction({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="text-center max-w-32">
      <p className={`text-lg font-semibold tabular-nums ${scoreColor(pct)}`}>{pct}%</p>
      <p className="text-[10px] text-[#9CA3AF] leading-tight">{label}</p>
    </div>
  );
}

/** Three compact score chips used on candidate cards. */
export function CompatibilityChips({
  score,
}: {
  score: Pick<MatchScore, "forward_percentage" | "reverse_percentage" | "overall_percentage">;
}) {
  const chips = [
    { pct: score.forward_percentage, label: "A → B" },
    { pct: score.reverse_percentage, label: "B → A" },
    { pct: score.overall_percentage, label: "Overall" },
  ];
  return (
    <div className="flex gap-2">
      {chips.map((c) => (
        <div
          key={c.label}
          className="flex-1 min-w-0 bg-[#F7F7FA] border border-[#E5E5EA] rounded-lg px-2 py-1.5 text-center"
        >
          <p className={`text-sm font-bold tabular-nums ${scoreColor(c.pct)}`}>{c.pct}%</p>
          <p className="text-[10px] text-[#9CA3AF] truncate">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
