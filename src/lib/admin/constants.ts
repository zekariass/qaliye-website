export const ADMIN_COOKIE_NAME = "admin_session";
export const ADMIN_API_PREFIX = "/api/internal-admin";
export const BACKEND_ADMIN_PREFIX = "/api/v1/admin";

export const AdminRole = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
} as const;
export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];

export const UserStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  BANNED: "BANNED",
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  DELETED: "DELETED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const OrderStatus = {
  CREATED: "CREATED",
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  VERIFICATION_PENDING: "VERIFICATION_PENDING",
  MANUAL_REVIEW: "MANUAL_REVIEW",
  RECEIPT_SUBMITTED: "RECEIPT_SUBMITTED",
  REVIEW_REQUIRED: "REVIEW_REQUIRED",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const TransactionStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const CampaignStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;
export type CampaignStatus = (typeof CampaignStatus)[keyof typeof CampaignStatus];

export const NotificationCampaignStatus = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type NotificationCampaignStatus =
  (typeof NotificationCampaignStatus)[keyof typeof NotificationCampaignStatus];
