import type {
  UserStatus,
  OrderStatus,
  TransactionStatus,
  CampaignStatus,
  NotificationCampaignStatus,
} from "./constants";

export interface AdminSessionPayload {
  sub: string;
  role: "ADMIN" | "MODERATOR";
  displayName?: string;
  email?: string;
  exp: number;
  iat: number;
}

export interface AdminUser {
  userId: string;
  displayName: string;
  email?: string;
  phone?: string;
  status: UserStatus;
  role: string;
  gender?: string;
  age?: number;
  preferredLanguage?: string;
  residencyType?: string;
  relationshipIntention?: string;
  isOnboarded?: boolean;
  isVerified?: boolean;
  isVisible?: boolean;
  profileCompletionScore?: number;
  photoCount?: number;
  pendingPhotoCount?: number;
  approvedPhotoCount?: number;
  rejectedPhotoCount?: number;
  manualReviewPhotoCount?: number;
  reportCount?: number;
  pendingReportCount?: number;
  verificationStatus?: string;
  activeMatchCount?: number;
  isPremium?: boolean;
  createdAt: string;
  updatedAt?: string;
  lastActiveAt?: string;
  deletedAt?: string;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  userDisplayName?: string;
  orderReference: string;
  status: OrderStatus;
  expectedAmountMinorUnits: number;
  currency: string;
  paymentMethodId?: string;
  paymentChannel?: string;
  paymentMethod?: string;
  methodCode?: string;
  methodDisplayName?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ManualTransaction {
  transactionId: string;
  userId: string;
  userDisplayName?: string;
  provider: string;
  amountCents: number;
  currency?: string;
  paymentPurpose?: string;
  planCode?: string;
  status: TransactionStatus;
  receiptImageUrl?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface PromotionalCampaign {
  id: string;
  name: string;
  campaignKey: string;
  description?: string;
  status: CampaignStatus;
  triggerType: string;
  eligibilityType: string;
  benefitType: string;
  discountType?: string;
  discountValue?: number;
  discountCurrency?: string;
  subscriptionProductId?: string;
  countryCode?: string;
  durationDays?: number;
  newUserWindowDays?: number;
  maxRedemptions?: number;
  maxRedemptionsPerUser?: number;
  reservedCount?: number;
  fulfilledCount?: number;
  currentRedemptions?: number;
  priority?: number;
  startsAt?: string;
  endsAt?: string;
  targetGender?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationCampaign {
  id: string;
  campaignKey?: string;
  name?: string;
  title: string;
  body: string;
  status: NotificationCampaignStatus;
  targetAudience?: string;
  navigationPayload?: Record<string, unknown>;
  audienceDefinition?: Record<string, unknown>;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  sentCount?: number;
  createdByUserId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorDisplayName?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  requestId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  code?: string;
  countryCode?: string;
  nativeName?: string;
  region?: string;
  sortOrder?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface ModerationCounts {
  pending: number;
  manualReview: number;
  approved: number;
  rejected: number;
}

export interface ReviewQueueItem {
  id: string;
  userId: string;
  imageUrl: string;
  moderationStatus: string;
  createdAt: string;
  displayName?: string;
}

export interface Redemption {
  id: string;
  campaignId: string;
  campaignKey?: string;
  userId: string;
  subscriptionId?: string;
  paymentOrderId?: string;
  status: string;
  eligibilityCountry?: string;
  eligibilityGender?: string;
  originalAmountMinor?: number;
  discountAmountMinor?: number;
  finalAmountMinor?: number;
  currency?: string;
  reservedAt?: string;
  fulfilledAt?: string;
  cancelledAt?: string;
  expiredAt?: string;
  failureCode?: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  pendingPhotoReviews: number;
  pendingOrders: number;
  revenueToday?: number;
  revenueCurrency?: string;
  suspendedUsers?: number;
  bannedUsers?: number;
  deactivatedUsers?: number;
  deletedUsers?: number;
  activeSubscriptions?: number;
  recentAuditEvents?: AuditLogEntry[];
}

export function adaptUser(raw: Record<string, unknown>): AdminUser {
  return {
    userId: String(raw.userId ?? raw.user_id ?? raw.id ?? ""),
    displayName: String(raw.displayName ?? raw.display_name ?? raw.name ?? "Unknown"),
    email: raw.email ? String(raw.email) : undefined,
    phone: raw.phone ? String(raw.phone) : undefined,
    status: String(raw.status ?? "ACTIVE") as UserStatus,
    role: String(raw.role ?? "USER"),
    gender: raw.gender ? String(raw.gender) : undefined,
    age: typeof raw.age === "number" ? raw.age : undefined,
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
    lastActiveAt: raw.lastActiveAt
      ? String(raw.lastActiveAt)
      : raw.last_active_at
        ? String(raw.last_active_at)
        : undefined,
    photoCount:
      typeof raw.photoCount === "number"
        ? raw.photoCount
        : typeof raw.photo_count === "number"
          ? raw.photo_count
          : undefined,
    reportCount:
      typeof raw.reportCount === "number"
        ? raw.reportCount
        : typeof raw.report_count === "number"
          ? raw.report_count
          : undefined,
    isPremium: Boolean(raw.isPremium ?? raw.is_premium ?? false),
    preferredLanguage: raw.preferredLanguage ? String(raw.preferredLanguage) : raw.preferred_language ? String(raw.preferred_language) : undefined,
    residencyType: raw.residencyType ? String(raw.residencyType) : raw.residency_type ? String(raw.residency_type) : undefined,
    relationshipIntention: raw.relationshipIntention ? String(raw.relationshipIntention) : raw.relationship_intention ? String(raw.relationship_intention) : undefined,
    isOnboarded: typeof raw.isOnboarded === "boolean" ? raw.isOnboarded : typeof raw.is_onboarded === "boolean" ? raw.is_onboarded : undefined,
    isVerified: typeof raw.isVerified === "boolean" ? raw.isVerified : typeof raw.is_verified === "boolean" ? raw.is_verified : undefined,
    isVisible: typeof raw.isVisible === "boolean" ? raw.isVisible : typeof raw.is_visible === "boolean" ? raw.is_visible : undefined,
    profileCompletionScore: typeof raw.profileCompletionScore === "number" ? raw.profileCompletionScore : typeof raw.profile_completion_score === "number" ? raw.profile_completion_score : undefined,
    pendingPhotoCount: typeof raw.pendingPhotoCount === "number" ? raw.pendingPhotoCount : typeof raw.pending_photo_count === "number" ? raw.pending_photo_count : undefined,
    approvedPhotoCount: typeof raw.approvedPhotoCount === "number" ? raw.approvedPhotoCount : typeof raw.approved_photo_count === "number" ? raw.approved_photo_count : undefined,
    rejectedPhotoCount: typeof raw.rejectedPhotoCount === "number" ? raw.rejectedPhotoCount : typeof raw.rejected_photo_count === "number" ? raw.rejected_photo_count : undefined,
    manualReviewPhotoCount: typeof raw.manualReviewPhotoCount === "number" ? raw.manualReviewPhotoCount : typeof raw.manual_review_photo_count === "number" ? raw.manual_review_photo_count : undefined,
    pendingReportCount: typeof raw.pendingReportCount === "number" ? raw.pendingReportCount : typeof raw.pending_report_count === "number" ? raw.pending_report_count : undefined,
    verificationStatus: raw.verificationStatus ? String(raw.verificationStatus) : raw.verification_status ? String(raw.verification_status) : undefined,
    activeMatchCount: typeof raw.activeMatchCount === "number" ? raw.activeMatchCount : typeof raw.active_match_count === "number" ? raw.active_match_count : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : raw.updated_at ? String(raw.updated_at) : undefined,
    deletedAt: raw.deletedAt ? String(raw.deletedAt) : raw.deleted_at ? String(raw.deleted_at) : undefined,
  };
}

export function adaptPaymentOrder(raw: Record<string, unknown>): PaymentOrder {
  return {
    id: String(raw.id ?? raw.orderId ?? raw.order_id ?? ""),
    userId: String(raw.userId ?? raw.user_id ?? ""),
    userDisplayName: raw.userDisplayName
      ? String(raw.userDisplayName)
      : raw.user_display_name
        ? String(raw.user_display_name)
        : undefined,
    orderReference: String(raw.orderReference ?? raw.order_reference ?? ""),
    status: String(raw.status ?? "MANUAL_REVIEW") as OrderStatus,
    expectedAmountMinorUnits:
      typeof raw.expectedAmountMinorUnits === "number"
        ? raw.expectedAmountMinorUnits
        : typeof raw.expected_amount_minor_units === "number"
          ? raw.expected_amount_minor_units
          : 0,
    currency: String(raw.currency ?? raw.expectedCurrency ?? raw.expected_currency ?? "ETB"),
    paymentMethodId: raw.paymentMethodId ? String(raw.paymentMethodId) : raw.payment_method_id ? String(raw.payment_method_id) : undefined,
    paymentChannel: raw.paymentChannel ? String(raw.paymentChannel) : raw.payment_channel ? String(raw.payment_channel) : undefined,
    paymentMethod: raw.paymentMethod ? String(raw.paymentMethod) : undefined,
    methodCode: raw.methodCode
      ? String(raw.methodCode)
      : raw.method_code
        ? String(raw.method_code)
        : undefined,
    methodDisplayName: raw.methodDisplayName
      ? String(raw.methodDisplayName)
      : raw.method_display_name
        ? String(raw.method_display_name)
        : raw.paymentMethodDisplayName
          ? String(raw.paymentMethodDisplayName)
          : undefined,
    receiptUrl: raw.receiptUrl
      ? String(raw.receiptUrl)
      : raw.receipt_url
        ? String(raw.receipt_url)
        : undefined,
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
    updatedAt: raw.updatedAt
      ? String(raw.updatedAt)
      : raw.updated_at
        ? String(raw.updated_at)
        : undefined,
  };
}

export function adaptDashboardMetrics(raw: Record<string, unknown>): DashboardMetrics {
  const users = (raw.users ?? {}) as Record<string, unknown>;
  const moderation = (raw.moderation ?? {}) as Record<string, unknown>;
  const revenue = (raw.revenue ?? {}) as Record<string, unknown>;
  const subscriptions = (raw.subscriptions ?? {}) as Record<string, unknown>;

  return {
    totalUsers: Number(users.total_users ?? users.totalUsers ?? 0),
    activeUsers: Number(users.active_users ?? users.activeUsers ?? 0),
    newUsersToday: Number(users.new_users_24h ?? users.newUsersToday ?? 0),
    pendingPhotoReviews: Number(
      moderation.photos_pending ?? moderation.photosPending ?? 0
    ),
    pendingOrders: Number(revenue.pending_orders ?? revenue.pendingOrders ?? 0),
    revenueToday: revenue.revenue_24h != null ? Number(revenue.revenue_24h) : undefined,
    revenueCurrency: "ETB",
    suspendedUsers: Number(users.suspended_users ?? users.suspendedUsers ?? 0),
    bannedUsers: Number(users.banned_users ?? users.bannedUsers ?? 0),
    deactivatedUsers: Number(users.deactivated_users ?? users.deactivatedUsers ?? 0),
    deletedUsers: Number(users.deleted_users ?? users.deletedUsers ?? 0),
    activeSubscriptions: Number(
      subscriptions.active_subscriptions ?? subscriptions.activeSubscriptions ?? 0
    ),
  };
}

export function adaptManualTransaction(raw: Record<string, unknown>): ManualTransaction {
  return {
    transactionId: String(raw.transactionId ?? raw.transaction_id ?? raw.id ?? ""),
    userId: String(raw.userId ?? raw.user_id ?? ""),
    userDisplayName: raw.userDisplayName
      ? String(raw.userDisplayName)
      : raw.user_display_name
        ? String(raw.user_display_name)
        : undefined,
    provider: String(raw.provider ?? ""),
    amountCents:
      typeof raw.amountCents === "number"
        ? raw.amountCents
        : typeof raw.amount_cents === "number"
          ? raw.amount_cents
          : 0,
    currency: raw.currency ? String(raw.currency) : "ETB",
    paymentPurpose: raw.paymentPurpose
      ? String(raw.paymentPurpose)
      : raw.payment_purpose
        ? String(raw.payment_purpose)
        : undefined,
    planCode: raw.planCode
      ? String(raw.planCode)
      : raw.plan_code
        ? String(raw.plan_code)
        : undefined,
    status: String(raw.status ?? "PENDING") as TransactionStatus,
    receiptImageUrl: raw.receiptImageUrl
      ? String(raw.receiptImageUrl)
      : raw.receipt_image_url
        ? String(raw.receipt_image_url)
        : undefined,
    adminNotes: raw.adminNotes
      ? String(raw.adminNotes)
      : raw.admin_notes
        ? String(raw.admin_notes)
        : undefined,
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
  };
}

export function adaptAuditLogEntry(raw: Record<string, unknown>): AuditLogEntry {
  let details: Record<string, unknown> | undefined;
  if (raw.details) {
    if (typeof raw.details === "string") {
      try { details = JSON.parse(raw.details); } catch { details = undefined; }
    } else if (typeof raw.details === "object") {
      details = raw.details as Record<string, unknown>;
    }
  }
  return {
    id: String(raw.id ?? ""),
    actorId: String(raw.actorUserId ?? raw.actor_user_id ?? raw.actorId ?? ""),
    actorDisplayName: raw.actorDisplayName ? String(raw.actorDisplayName) : raw.actor_display_name ? String(raw.actor_display_name) : undefined,
    action: String(raw.action ?? ""),
    targetType: raw.targetTable ? String(raw.targetTable) : raw.target_table ? String(raw.target_table) : raw.targetType ? String(raw.targetType) : undefined,
    targetId: raw.targetId ? String(raw.targetId) : raw.target_id ? String(raw.target_id) : undefined,
    requestId: raw.requestId ? String(raw.requestId) : raw.request_id ? String(raw.request_id) : undefined,
    details,
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
  };
}

export function adaptModerationCounts(raw: Record<string, unknown>): ModerationCounts {
  return {
    pending: Number(raw.pending ?? 0),
    manualReview: Number(raw.manual_review ?? raw.manualReview ?? 0),
    approved: Number(raw.approved ?? 0),
    rejected: Number(raw.rejected ?? 0),
  };
}

export function adaptReviewQueueItem(raw: Record<string, unknown>): ReviewQueueItem {
  return {
    id: String(raw.id ?? ""),
    userId: String(raw.userId ?? raw.user_id ?? ""),
    imageUrl: String(raw.imageUrl ?? raw.image_url ?? ""),
    moderationStatus: String(raw.moderationStatus ?? raw.moderation_status ?? "PENDING"),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
    displayName: raw.displayName ? String(raw.displayName) : raw.display_name ? String(raw.display_name) : undefined,
  };
}

export function adaptPromotionalCampaign(raw: Record<string, unknown>): PromotionalCampaign {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    campaignKey: String(raw.campaignKey ?? raw.campaign_key ?? ""),
    description: raw.description ? String(raw.description) : undefined,
    status: String(raw.status ?? "DRAFT") as CampaignStatus,
    triggerType: String(raw.triggerType ?? raw.trigger_type ?? ""),
    eligibilityType: String(raw.eligibilityType ?? raw.eligibility_type ?? ""),
    benefitType: String(raw.benefitType ?? raw.benefit_type ?? ""),
    discountType: raw.discountType ? String(raw.discountType) : raw.discount_type ? String(raw.discount_type) : undefined,
    discountValue: typeof raw.discountValue === "number" ? raw.discountValue : typeof raw.discount_value === "number" ? raw.discount_value : undefined,
    discountCurrency: raw.discountCurrency ? String(raw.discountCurrency) : raw.discount_currency ? String(raw.discount_currency) : undefined,
    subscriptionProductId: raw.subscriptionProductId ? String(raw.subscriptionProductId) : raw.subscription_product_id ? String(raw.subscription_product_id) : undefined,
    countryCode: raw.countryCode ? String(raw.countryCode) : raw.country_code ? String(raw.country_code) : undefined,
    durationDays: typeof raw.durationDays === "number" ? raw.durationDays : typeof raw.duration_days === "number" ? raw.duration_days : undefined,
    newUserWindowDays: typeof raw.newUserWindowDays === "number" ? raw.newUserWindowDays : typeof raw.new_user_window_days === "number" ? raw.new_user_window_days : undefined,
    maxRedemptions: typeof raw.maxRedemptions === "number" ? raw.maxRedemptions : typeof raw.max_redemptions === "number" ? raw.max_redemptions : undefined,
    maxRedemptionsPerUser: typeof raw.maxRedemptionsPerUser === "number" ? raw.maxRedemptionsPerUser : typeof raw.max_redemptions_per_user === "number" ? raw.max_redemptions_per_user : undefined,
    reservedCount: typeof raw.reservedCount === "number" ? raw.reservedCount : typeof raw.reserved_count === "number" ? raw.reserved_count : undefined,
    fulfilledCount: typeof raw.fulfilledCount === "number" ? raw.fulfilledCount : typeof raw.fulfilled_count === "number" ? raw.fulfilled_count : undefined,
    currentRedemptions: typeof raw.currentRedemptions === "number" ? raw.currentRedemptions : typeof raw.current_redemptions === "number" ? raw.current_redemptions : (typeof raw.reservedCount === "number" || typeof raw.reserved_count === "number") ? (typeof raw.reservedCount === "number" ? raw.reservedCount : (raw.reserved_count as number)) + (typeof raw.fulfilledCount === "number" ? raw.fulfilledCount : typeof raw.fulfilled_count === "number" ? raw.fulfilled_count : 0) : undefined,
    priority: typeof raw.priority === "number" ? raw.priority : undefined,
    startsAt: raw.startsAt ? String(raw.startsAt) : raw.starts_at ? String(raw.starts_at) : undefined,
    endsAt: raw.endsAt ? String(raw.endsAt) : raw.ends_at ? String(raw.ends_at) : undefined,
    targetGender: raw.targetGender ? String(raw.targetGender) : raw.target_gender ? String(raw.target_gender) : undefined,
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : raw.updated_at ? String(raw.updated_at) : undefined,
  };
}

export function adaptNotificationCampaign(raw: Record<string, unknown>): NotificationCampaign {
  return {
    id: String(raw.id ?? ""),
    campaignKey: raw.campaignKey ? String(raw.campaignKey) : raw.campaign_key ? String(raw.campaign_key) : undefined,
    name: raw.name ? String(raw.name) : raw.title ? String(raw.title) : undefined,
    title: String(raw.title ?? ""),
    body: String(raw.body ?? ""),
    status: String(raw.status ?? "DRAFT") as NotificationCampaignStatus,
    targetAudience: raw.targetAudience ? String(raw.targetAudience) : raw.target_audience ? String(raw.target_audience) : raw.audienceDefinition ? JSON.stringify(raw.audienceDefinition) : undefined,
    navigationPayload: typeof raw.navigationPayload === "object" && raw.navigationPayload !== null ? raw.navigationPayload as Record<string, unknown> : undefined,
    audienceDefinition: typeof raw.audienceDefinition === "object" && raw.audienceDefinition !== null ? raw.audienceDefinition as Record<string, unknown> : undefined,
    scheduledAt: raw.scheduledAt ? String(raw.scheduledAt) : raw.scheduled_at ? String(raw.scheduled_at) : undefined,
    startedAt: raw.startedAt ? String(raw.startedAt) : raw.started_at ? String(raw.started_at) : undefined,
    completedAt: raw.completedAt ? String(raw.completedAt) : raw.completed_at ? String(raw.completed_at) : undefined,
    cancelledAt: raw.cancelledAt ? String(raw.cancelledAt) : raw.cancelled_at ? String(raw.cancelled_at) : undefined,
    sentCount: typeof raw.sentCount === "number" ? raw.sentCount : typeof raw.sent_count === "number" ? raw.sent_count : typeof raw.notifications_fanout_complete === "number" ? raw.notifications_fanout_complete : undefined,
    createdByUserId: raw.createdByUserId ? String(raw.createdByUserId) : raw.created_by_user_id ? String(raw.created_by_user_id) : undefined,
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : raw.updated_at ? String(raw.updated_at) : undefined,
  };
}

export function adaptRedemption(raw: Record<string, unknown>): Redemption {
  return {
    id: String(raw.id ?? ""),
    campaignId: String(raw.campaignId ?? raw.campaign_id ?? ""),
    campaignKey: raw.campaignKey ? String(raw.campaignKey) : raw.campaign_key ? String(raw.campaign_key) : undefined,
    userId: String(raw.userId ?? raw.user_id ?? ""),
    subscriptionId: raw.subscriptionId ? String(raw.subscriptionId) : raw.subscription_id ? String(raw.subscription_id) : undefined,
    paymentOrderId: raw.paymentOrderId ? String(raw.paymentOrderId) : raw.payment_order_id ? String(raw.payment_order_id) : undefined,
    status: String(raw.status ?? ""),
    eligibilityCountry: raw.eligibilityCountry ? String(raw.eligibilityCountry) : raw.eligibility_country ? String(raw.eligibility_country) : undefined,
    eligibilityGender: raw.eligibilityGender ? String(raw.eligibilityGender) : raw.eligibility_gender ? String(raw.eligibility_gender) : undefined,
    originalAmountMinor: typeof raw.originalAmountMinor === "number" ? raw.originalAmountMinor : typeof raw.original_amount_minor === "number" ? raw.original_amount_minor : undefined,
    discountAmountMinor: typeof raw.discountAmountMinor === "number" ? raw.discountAmountMinor : typeof raw.discount_amount_minor === "number" ? raw.discount_amount_minor : undefined,
    finalAmountMinor: typeof raw.finalAmountMinor === "number" ? raw.finalAmountMinor : typeof raw.final_amount_minor === "number" ? raw.final_amount_minor : undefined,
    currency: raw.currency ? String(raw.currency) : undefined,
    reservedAt: raw.reservedAt ? String(raw.reservedAt) : raw.reserved_at ? String(raw.reserved_at) : undefined,
    fulfilledAt: raw.fulfilledAt ? String(raw.fulfilledAt) : raw.fulfilled_at ? String(raw.fulfilled_at) : undefined,
    cancelledAt: raw.cancelledAt ? String(raw.cancelledAt) : raw.cancelled_at ? String(raw.cancelled_at) : undefined,
    expiredAt: raw.expiredAt ? String(raw.expiredAt) : raw.expired_at ? String(raw.expired_at) : undefined,
    failureCode: raw.failureCode ? String(raw.failureCode) : raw.failure_code ? String(raw.failure_code) : undefined,
  };
}

export function adaptCatalogItem(raw: Record<string, unknown>): CatalogItem {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    code: raw.code ? String(raw.code) : undefined,
    countryCode: raw.countryCode ? String(raw.countryCode) : raw.country_code ? String(raw.country_code) : undefined,
    nativeName: raw.nativeName ? String(raw.nativeName) : raw.native_name ? String(raw.native_name) : undefined,
    region: raw.region ? String(raw.region) : undefined,
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : typeof raw.sort_order === "number" ? raw.sort_order : undefined,
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : typeof raw.is_active === "boolean" ? raw.is_active : undefined,
    isDeleted: typeof raw.isDeleted === "boolean" ? raw.isDeleted : typeof raw.is_deleted === "boolean" ? raw.is_deleted : undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : raw.created_at ? String(raw.created_at) : undefined,
  };
}

export interface SubscriptionProduct {
  id: string;
  planId?: string;
  productCode: string;
  planCode: string;
  planName: string;
  billingIntervalUnit: string;
  billingIntervalCount: number;
  autoRenewSupported: boolean;
  includedCredits: number;
  isActive: boolean;
}

export function adaptSubscriptionProduct(raw: Record<string, unknown>): SubscriptionProduct {
  return {
    id: String(raw.id ?? ""),
    planId: raw.planId ? String(raw.planId) : raw.plan_id ? String(raw.plan_id) : undefined,
    productCode: String(raw.productCode ?? raw.product_code ?? ""),
    planCode: String(raw.planCode ?? raw.plan_code ?? ""),
    planName: String(raw.planName ?? raw.plan_name ?? ""),
    billingIntervalUnit: String(raw.billingIntervalUnit ?? raw.billing_interval_unit ?? ""),
    billingIntervalCount: typeof raw.billingIntervalCount === "number" ? raw.billingIntervalCount : typeof raw.billing_interval_count === "number" ? raw.billing_interval_count : 0,
    autoRenewSupported: typeof raw.autoRenewSupported === "boolean" ? raw.autoRenewSupported : typeof raw.auto_renew_supported === "boolean" ? raw.auto_renew_supported : false,
    includedCredits: typeof raw.includedCredits === "number" ? raw.includedCredits : typeof raw.included_credits === "number" ? raw.included_credits : 0,
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : typeof raw.is_active === "boolean" ? raw.is_active : false,
  };
}

// ── Identity Reviews ──────────────────────────────────────────────────────────

export interface IdentityReview {
  id: string;
  userId: string;
  displayName?: string;
  gender?: string;
  selfiePath: string;
  profilePhotoPath?: string;
  createdAt: string;
}

export function adaptIdentityReview(raw: Record<string, unknown>): IdentityReview {
  return {
    id: String(raw.id ?? ""),
    userId: String(raw.userId ?? raw.user_id ?? ""),
    displayName: raw.displayName ? String(raw.displayName) : raw.display_name ? String(raw.display_name) : undefined,
    gender: raw.gender ? String(raw.gender) : undefined,
    selfiePath: String(raw.selfiePath ?? raw.selfie_path ?? ""),
    profilePhotoPath: raw.profilePhotoPath ? String(raw.profilePhotoPath) : raw.profile_photo_path ? String(raw.profile_photo_path) : undefined,
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
  };
}

// ── Report Queue ──────────────────────────────────────────────────────────────

export interface ReportItem {
  id: string;
  reporterUserId: string;
  reportedUserId: string;
  reportType: string;
  description?: string;
  relatedMessageId?: string;
  status: string;
  createdAt: string;
  reportedDisplayName?: string;
}

export function adaptReportItem(raw: Record<string, unknown>): ReportItem {
  return {
    id: String(raw.id ?? ""),
    reporterUserId: String(raw.reporterUserId ?? raw.reporter_user_id ?? ""),
    reportedUserId: String(raw.reportedUserId ?? raw.reported_user_id ?? ""),
    reportType: String(raw.reportType ?? raw.report_type ?? ""),
    description: raw.description ? String(raw.description) : undefined,
    relatedMessageId: raw.relatedMessageId ? String(raw.relatedMessageId) : raw.related_message_id ? String(raw.related_message_id) : undefined,
    status: String(raw.status ?? "PENDING"),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
    reportedDisplayName: raw.reportedDisplayName ? String(raw.reportedDisplayName) : raw.reported_display_name ? String(raw.reported_display_name) : undefined,
  };
}

// ── Payment Config Types ──────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: string;
  name: string;
  planCode: string;
  countryCode: string;
  planKind: string;
  priceMinorUnits: number;
  currency: string;
  billingInterval: string;
  features?: string;
  isActive: boolean;
}

export function adaptSubscriptionPlan(raw: Record<string, unknown>): SubscriptionPlan {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    planCode: String(raw.planCode ?? raw.plan_code ?? ""),
    countryCode: String(raw.countryCode ?? raw.country_code ?? ""),
    planKind: String(raw.planKind ?? raw.plan_kind ?? "PAID"),
    priceMinorUnits: typeof raw.priceMinorUnits === "number" ? raw.priceMinorUnits : typeof raw.price_minor_units === "number" ? raw.price_minor_units : 0,
    currency: String(raw.currency ?? "ETB"),
    billingInterval: String(raw.billingInterval ?? raw.billing_interval ?? ""),
    features: raw.features ? String(raw.features) : undefined,
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : typeof raw.is_active === "boolean" ? raw.is_active : true,
  };
}

export interface ConsumableProduct {
  id: string;
  productCode: string;
  name: string;
  entitlementType: string;
  quantityGranted: number;
  expiresAfterDays?: number;
  isActive: boolean;
}

export function adaptConsumableProduct(raw: Record<string, unknown>): ConsumableProduct {
  return {
    id: String(raw.id ?? ""),
    productCode: String(raw.productCode ?? raw.product_code ?? ""),
    name: String(raw.name ?? ""),
    entitlementType: String(raw.entitlementType ?? raw.entitlement_type ?? ""),
    quantityGranted: typeof raw.quantityGranted === "number" ? raw.quantityGranted : typeof raw.quantity_granted === "number" ? raw.quantity_granted : 0,
    expiresAfterDays: typeof raw.expiresAfterDays === "number" ? raw.expiresAfterDays : typeof raw.expires_after_days === "number" ? raw.expires_after_days : undefined,
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : typeof raw.is_active === "boolean" ? raw.is_active : true,
  };
}

export interface PaymentOffer {
  id: string;
  subscriptionProductId?: string;
  consumableProductId?: string;
  countryCode: string;
  platform: string;
  currency: string;
  priceMinorUnits: number;
  externalProductId?: string;
  revenuecatOfferingId?: string;
  revenuecatPackageId?: string;
  autoRenew: boolean;
  isActive: boolean;
}

export function adaptPaymentOffer(raw: Record<string, unknown>): PaymentOffer {
  return {
    id: String(raw.id ?? ""),
    subscriptionProductId: raw.subscriptionProductId ? String(raw.subscriptionProductId) : raw.subscription_product_id ? String(raw.subscription_product_id) : undefined,
    consumableProductId: raw.consumableProductId ? String(raw.consumableProductId) : raw.consumable_product_id ? String(raw.consumable_product_id) : undefined,
    countryCode: String(raw.countryCode ?? raw.country_code ?? ""),
    platform: String(raw.platform ?? ""),
    currency: String(raw.currency ?? "ETB"),
    priceMinorUnits: typeof raw.priceMinorUnits === "number" ? raw.priceMinorUnits : typeof raw.price_minor_units === "number" ? raw.price_minor_units : 0,
    externalProductId: raw.externalProductId ? String(raw.externalProductId) : raw.external_product_id ? String(raw.external_product_id) : undefined,
    revenuecatOfferingId: raw.revenuecatOfferingId ? String(raw.revenuecatOfferingId) : raw.revenuecat_offering_id ? String(raw.revenuecat_offering_id) : undefined,
    revenuecatPackageId: raw.revenuecatPackageId ? String(raw.revenuecatPackageId) : raw.revenuecat_package_id ? String(raw.revenuecat_package_id) : undefined,
    autoRenew: typeof raw.autoRenew === "boolean" ? raw.autoRenew : typeof raw.auto_renew === "boolean" ? raw.auto_renew : false,
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : typeof raw.is_active === "boolean" ? raw.is_active : true,
  };
}

export interface PaymentMethod {
  id: string;
  countryCode: string;
  platform: string;
  methodCode: string;
  displayName: string;
  paymentChannel: string;
  paymentMethod: string;
  paymentInstructions?: string;
  isActive: boolean;
  displayOrder: number;
  metadata?: string;
  verificationParams?: string;
  logoUrl?: string;
}

export function adaptPaymentMethod(raw: Record<string, unknown>): PaymentMethod {
  return {
    id: String(raw.id ?? ""),
    countryCode: String(raw.countryCode ?? raw.country_code ?? ""),
    platform: String(raw.platform ?? ""),
    methodCode: String(raw.methodCode ?? raw.method_code ?? ""),
    displayName: String(raw.displayName ?? raw.display_name ?? ""),
    paymentChannel: String(raw.paymentChannel ?? raw.payment_channel ?? ""),
    paymentMethod: String(raw.paymentMethod ?? raw.payment_method ?? ""),
    paymentInstructions: raw.paymentInstructions ? String(raw.paymentInstructions) : raw.payment_instructions ? String(raw.payment_instructions) : undefined,
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : typeof raw.is_active === "boolean" ? raw.is_active : true,
    displayOrder: typeof raw.displayOrder === "number" ? raw.displayOrder : typeof raw.display_order === "number" ? raw.display_order : 0,
    metadata: raw.metadata ? String(raw.metadata) : undefined,
    verificationParams: raw.verificationParams ? String(raw.verificationParams) : raw.verification_params ? String(raw.verification_params) : undefined,
    logoUrl: raw.logoUrl ? String(raw.logoUrl) : raw.logo_url ? String(raw.logo_url) : undefined,
  };
}

export interface PlanLimitCost {
  id: string;
  subscriptionPlanId: string;
  featureActionId: string;
  memberCreditCost: number;
  actualCreditCost: number;
  limitValue: number;
  periodType: string;
  applyCreditAfterLimit: boolean;
}

export function adaptPlanLimitCost(raw: Record<string, unknown>): PlanLimitCost {
  return {
    id: String(raw.id ?? ""),
    subscriptionPlanId: String(raw.subscriptionPlanId ?? raw.subscription_plan_id ?? ""),
    featureActionId: String(raw.featureActionId ?? raw.feature_action_id ?? ""),
    memberCreditCost: typeof raw.memberCreditCost === "number" ? raw.memberCreditCost : typeof raw.member_credit_cost === "number" ? raw.member_credit_cost : 0,
    actualCreditCost: typeof raw.actualCreditCost === "number" ? raw.actualCreditCost : typeof raw.actual_credit_cost === "number" ? raw.actual_credit_cost : 0,
    limitValue: typeof raw.limitValue === "number" ? raw.limitValue : typeof raw.limit_value === "number" ? raw.limit_value : 0,
    periodType: String(raw.periodType ?? raw.period_type ?? "DAY"),
    applyCreditAfterLimit: typeof raw.applyCreditAfterLimit === "boolean" ? raw.applyCreditAfterLimit : typeof raw.apply_credit_after_limit === "boolean" ? raw.apply_credit_after_limit : false,
  };
}

export interface FeatureAction {
  id: string;
  code: string;
  name: string;
  type: string;
}

export function adaptFeatureAction(raw: Record<string, unknown>): FeatureAction {
  return {
    id: String(raw.id ?? ""),
    code: String(raw.code ?? ""),
    name: String(raw.name ?? ""),
    type: String(raw.type ?? "ACTION"),
  };
}

export interface CountrySetting {
  id: string;
  countryCode: string;
  subscriptionEnabled: boolean;
  creditsEnabled: boolean;
  identityVerificationRequired: boolean;
}

export function adaptCountrySetting(raw: Record<string, unknown>): CountrySetting {
  return {
    id: String(raw.id ?? ""),
    countryCode: String(raw.countryCode ?? raw.country_code ?? ""),
    subscriptionEnabled: typeof raw.subscriptionEnabled === "boolean" ? raw.subscriptionEnabled : typeof raw.subscription_enabled === "boolean" ? raw.subscription_enabled : false,
    creditsEnabled: typeof raw.creditsEnabled === "boolean" ? raw.creditsEnabled : typeof raw.credits_enabled === "boolean" ? raw.credits_enabled : false,
    identityVerificationRequired: typeof raw.identityVerificationRequired === "boolean" ? raw.identityVerificationRequired : typeof raw.identity_verification_required === "boolean" ? raw.identity_verification_required : false,
  };
}
