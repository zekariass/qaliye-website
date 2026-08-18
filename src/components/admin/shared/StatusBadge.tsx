import type { UserStatus, OrderStatus, TransactionStatus, CampaignStatus, NotificationCampaignStatus } from "@/lib/admin/constants";

type AnyStatus =
  | UserStatus
  | OrderStatus
  | TransactionStatus
  | CampaignStatus
  | NotificationCampaignStatus
  | string;

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  APPROVED: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  VERIFIED: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  COMPLETED: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  FULFILLED: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  RESOLVED_NO_ACTION: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  RESOLVED_BANNED: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
  DEACTIVATED: "bg-gray-100 text-gray-500 border-gray-200",
  RUNNING: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  SENDING: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  SCHEDULED: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  RECEIPT_SUBMITTED: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  PENDING: "bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]",
  PENDING_VERIFICATION: "bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]",
  VERIFICATION_PENDING: "bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]",
  MANUAL_REVIEW: "bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]",
  REVIEW_REQUIRED: "bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]",
  CREATED: "bg-gray-50 text-gray-600 border-gray-200",
  AWAITING_PAYMENT: "bg-gray-50 text-gray-600 border-gray-200",
  DRAFT: "bg-gray-50 text-gray-600 border-gray-200",
  SUSPENDED: "bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]",
  PAUSED: "bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]",
  BANNED: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
  DECLINED: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
  REJECTED: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
  FAILED: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
  DELETED: "bg-gray-100 text-gray-500 border-gray-200 line-through",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
  EXPIRED: "bg-gray-100 text-gray-500 border-gray-200",
  REFUNDED: "bg-[#EDE2FF] text-[#6D28D9] border-[#C4B5FD]",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_VERIFICATION: "Pending Verification",
  RESOLVED_NO_ACTION: "No Action",
  RESOLVED_BANNED: "Banned",
};

interface StatusBadgeProps {
  status: AnyStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const label = STATUS_LABELS[status] ?? status.replace(/_/g, " ");
  const textSize = size === "sm" ? "text-xs" : "text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border ${textSize} ${style} whitespace-nowrap`}
    >
      {label}
    </span>
  );
}
