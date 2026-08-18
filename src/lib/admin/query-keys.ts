export const adminKeys = {
  dashboard: () => ["admin", "dashboard"] as const,

  users: {
    list: (params: Record<string, unknown>) => ["admin", "users", "list", params] as const,
    detail: (userId: string) => ["admin", "users", userId] as const,
  },

  moderation: {
    counts: () => ["admin", "moderation", "counts"] as const,
    manualReview: () => ["admin", "moderation", "manual-review"] as const,
    reviewQueue: (params: Record<string, unknown>) =>
      ["admin", "moderation", "queue", params] as const,
    reports: (params: Record<string, unknown>) =>
      ["admin", "moderation", "reports", params] as const,
  },

  identityReviews: {
    list: (params: Record<string, unknown>) =>
      ["admin", "identity-reviews", "list", params] as const,
  },

  billing: {
    orders: {
      list: (params: Record<string, unknown>) =>
        ["admin", "billing", "orders", "list", params] as const,
      detail: (orderId: string) =>
        ["admin", "billing", "orders", orderId] as const,
    },
    campaigns: {
      list: (params: Record<string, unknown>) =>
        ["admin", "billing", "campaigns", "list", params] as const,
      detail: (id: string) => ["admin", "billing", "campaigns", id] as const,
      redemptions: (id: string, params: Record<string, unknown>) =>
        ["admin", "billing", "campaigns", id, "redemptions", params] as const,
    },
    subscriptionProducts: () => ["admin", "billing", "subscription-products"] as const,
  },

  transactions: {
    list: (params: Record<string, unknown>) =>
      ["admin", "transactions", "list", params] as const,
  },

  notificationCampaigns: {
    list: (params: Record<string, unknown>) =>
      ["admin", "notification-campaigns", "list", params] as const,
    detail: (id: string) => ["admin", "notification-campaigns", id] as const,
  },

  catalog: {
    languages: () => ["admin", "catalog", "languages"] as const,
    ethnicities: () => ["admin", "catalog", "ethnicities"] as const,
  },

  auditLog: {
    list: (params: Record<string, unknown>) =>
      ["admin", "audit-log", "list", params] as const,
  },

  paymentConfig: {
    subscriptionPlans: () => ["admin", "payment-config", "subscription-plans"] as const,
    subscriptionProducts: () => ["admin", "payment-config", "subscription-products"] as const,
    consumableProducts: () => ["admin", "payment-config", "consumable-products"] as const,
    paymentOffers: () => ["admin", "payment-config", "payment-offers"] as const,
    paymentMethods: () => ["admin", "payment-config", "payment-methods"] as const,
    planLimitCosts: () => ["admin", "payment-config", "plan-limit-costs"] as const,
    featureActions: () => ["admin", "payment-config", "feature-actions"] as const,
    countrySettings: () => ["admin", "payment-config", "country-settings"] as const,
  },
} as const;
