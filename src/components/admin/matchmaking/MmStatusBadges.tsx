import type { RequestStatus, IntroStatus, CallStatus } from "@/lib/admin/matchmaking-types";

// ── Color maps ─────────────────────────────────────────────────────────────────

const REQUEST_STYLES: Record<RequestStatus, string> = {
  OPEN: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  ON_HOLD: "bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]",
  MATCHED: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  COMPLETED: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
  EXPIRED: "bg-gray-100 text-gray-500 border-gray-200",
};

const INTRO_STYLES: Record<IntroStatus, string> = {
  PROPOSED: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  DECLINED: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
  MUTUAL_INTEREST: "bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]",
  MATCHED: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
  EXPIRED: "bg-gray-100 text-gray-500 border-gray-200",
};

const CALL_STYLES: Record<CallStatus, string> = {
  ARRANGING: "bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]",
  SCHEDULED: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  IN_PROGRESS: "bg-[#EDE2FF] text-[#6D28D9] border-[#C4B5FD]",
  COMPLETED: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
  NO_SHOW: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
  FAILED: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
};

function Badge({ style, label }: { style: string; label: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium whitespace-nowrap ${style}`}>
      {label.replace(/_/g, " ")}
    </span>
  );
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return <Badge style={REQUEST_STYLES[status] ?? "bg-gray-100 text-gray-500 border-gray-200"} label={status} />;
}

export function IntroStatusBadge({ status }: { status: IntroStatus }) {
  return <Badge style={INTRO_STYLES[status] ?? "bg-gray-100 text-gray-500 border-gray-200"} label={status} />;
}

export function CallStatusBadge({ status }: { status: CallStatus }) {
  return <Badge style={CALL_STYLES[status] ?? "bg-gray-100 text-gray-500 border-gray-200"} label={status} />;
}
