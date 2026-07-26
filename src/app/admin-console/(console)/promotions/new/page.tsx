"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { adminKeys } from "@/lib/admin/query-keys";
import type { SubscriptionProduct } from "@/lib/admin/adapters";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  campaignKey: z.string().min(1, "Campaign key is required").max(50).regex(/^[a-z0-9_-]+$/, "Use lowercase letters, numbers, - and _ only"),
  description: z.string().optional(),
  triggerType: z.enum(["PURCHASE", "AUTO_ON_SIGNUP"]),
  eligibilityType: z.enum(["NEW_USER", "ALL_USERS"]),
  benefitType: z.enum(["DISCOUNT", "FREE_PREMIUM"]),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().positive().optional(),
  discountCurrency: z.string().optional(),
  subscriptionProductId: z.string().min(1, "Subscription product is required"),
  countryCode: z.string().min(1, "Country code is required"),
  durationDays: z.number().int().positive().optional(),
  newUserWindowDays: z.number().int().positive().optional(),
  maxRedemptions: z.number().int().positive().optional(),
  maxRedemptionsPerUser: z.number().int().positive().optional(),
  priority: z.number().int().optional(),
  startsAt: z.string().min(1, "Start time is required"),
  endsAt: z.string().optional(),
  targetGender: z.enum(["MALE", "FEMALE"]).optional(),
});

type FormValues = z.infer<typeof schema>;

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#17171B] mb-1.5">{label}{required && <span className="text-[#C63B4E] ml-0.5">*</span>}</label>
      {children}
      {error && <p className="mt-1 text-xs text-[#C63B4E]">{error}</p>}
    </div>
  );
}

export default function NewPromotionPage() {
  const router = useRouter();
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/promotions\/new$/, "");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { triggerType: "PURCHASE", eligibilityType: "ALL_USERS", benefitType: "DISCOUNT", discountCurrency: "ETB" },
  });

  const benefitType = watch("benefitType");

  const { data: productsData } = useQuery<{ products: SubscriptionProduct[] }>({
    queryKey: adminKeys.billing.subscriptionProducts(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/billing/subscription-products");
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    staleTime: 60_000,
  });

  const products = productsData?.products ?? [];

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: Record<string, unknown> = { ...values };
      if (values.startsAt) payload.startsAt = new Date(values.startsAt).toISOString();
      if (values.endsAt) payload.endsAt = new Date(values.endsAt).toISOString();
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined || payload[k] === "") delete payload[k];
      });
      const res = await fetch("/api/internal-admin/billing/campaigns", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create"); }
      return res.json();
    },
    onSuccess: (result) => {
      toast.success("Promotional campaign created");
      router.push(`${adminConsolePath}/promotions/${result.id}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/promotions`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Promotions
        </Link>
      </div>

      <PageHeader title="New Promotional Campaign" />

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-4">
        <Field label="Campaign Name" error={errors.name?.message} required>
          <input {...register("name")} className={INPUT} placeholder="e.g. Summer launch discount" />
        </Field>
        <Field label="Campaign Key" error={errors.campaignKey?.message} required>
          <input {...register("campaignKey")} className={`${INPUT} font-mono`} placeholder="e.g. summer-launch-2025" />
          <p className="mt-1 text-xs text-[#9CA3AF]">Unique, immutable identifier. Lowercase letters, numbers, hyphens.</p>
        </Field>

        <Field label="Description" error={errors.description?.message}>
          <textarea {...register("description")} rows={2} className={`${INPUT} resize-none`} placeholder="e.g. 20% off for new users" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Trigger Type" error={errors.triggerType?.message} required>
            <select {...register("triggerType")} className={INPUT}>
              <option value="PURCHASE">Purchase</option>
              <option value="AUTO_ON_SIGNUP">Auto on Signup</option>
            </select>
          </Field>
          <Field label="Eligibility" error={errors.eligibilityType?.message} required>
            <select {...register("eligibilityType")} className={INPUT}>
              <option value="ALL_USERS">All users</option>
              <option value="NEW_USER">New users only</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Benefit Type" error={errors.benefitType?.message} required>
            <select {...register("benefitType")} className={INPUT}>
              <option value="DISCOUNT">Discount</option>
              <option value="FREE_PREMIUM">Free Premium</option>
            </select>
          </Field>
          <Field label="Target Gender" error={errors.targetGender?.message}>
            <select {...register("targetGender")} className={INPUT}>
              <option value="">All genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </Field>
        </div>

        {benefitType === "DISCOUNT" && (
          <div className="grid grid-cols-3 gap-4">
            <Field label="Discount Type" error={errors.discountType?.message} required>
              <select {...register("discountType")} className={INPUT}>
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed amount</option>
              </select>
            </Field>
            <Field label="Discount Value" error={errors.discountValue?.message} required>
              <input {...register("discountValue", { valueAsNumber: true })} type="number" min="0" step="0.01" className={INPUT} placeholder="e.g. 20" />
            </Field>
            <Field label="Currency" error={errors.discountCurrency?.message}>
              <input {...register("discountCurrency")} className={INPUT} placeholder="ETB" />
            </Field>
          </div>
        )}

        <Field label="Subscription Product" error={errors.subscriptionProductId?.message} required>
          <select {...register("subscriptionProductId")} className={INPUT}>
            <option value="">Select a product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.planName} — {p.productCode} ({p.billingIntervalCount} {p.billingIntervalUnit.toLowerCase()}{p.billingIntervalCount > 1 ? "s" : ""})</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[#9CA3AF]">Linked subscription product for this campaign.</p>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Duration (days)" error={errors.durationDays?.message}>
            <input {...register("durationDays", { valueAsNumber: true })} type="number" min="1" className={INPUT} placeholder="e.g. 30" />
          </Field>
          <Field label="New User Window (days)" error={errors.newUserWindowDays?.message}>
            <input {...register("newUserWindowDays", { valueAsNumber: true })} type="number" min="1" className={INPUT} placeholder="e.g. 7" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Max Redemptions" error={errors.maxRedemptions?.message}>
            <input {...register("maxRedemptions", { valueAsNumber: true })} type="number" min="1" className={INPUT} placeholder="Unlimited" />
          </Field>
          <Field label="Max Per User" error={errors.maxRedemptionsPerUser?.message}>
            <input {...register("maxRedemptionsPerUser", { valueAsNumber: true })} type="number" min="1" className={INPUT} placeholder="1" />
          </Field>
          <Field label="Priority" error={errors.priority?.message}>
            <input {...register("priority", { valueAsNumber: true })} type="number" min="0" className={INPUT} placeholder="0" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Country Code" error={errors.countryCode?.message} required>
            <input {...register("countryCode")} className={INPUT} placeholder="e.g. ET" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Starts At" error={errors.startsAt?.message} required>
            <input {...register("startsAt")} type="datetime-local" className={INPUT} />
          </Field>
          <Field label="Ends At" error={errors.endsAt?.message}>
            <input {...register("endsAt")} type="datetime-local" className={INPUT} />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link href={`${adminConsolePath}/promotions`} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">Cancel</Link>
          <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50">
            {mutation.isPending ? "Creating…" : "Create campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
