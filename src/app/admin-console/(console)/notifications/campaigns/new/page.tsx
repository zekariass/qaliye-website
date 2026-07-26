"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  title: z.string().min(1, "Title is required").max(100),
  body: z.string().min(1, "Body is required").max(500),
  targetAudience: z.string().optional(),
  scheduledAt: z.string().optional(),
  dataPayload: z
    .string()
    .optional()
    .refine(
      (v) => { if (!v?.trim()) return true; try { JSON.parse(v); return true; } catch { return false; } },
      { message: "Must be valid JSON" }
    ),
});

type FormValues = z.infer<typeof schema>;

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#17171B] mb-1.5">{label}{required && <span className="text-[#C63B4E] ml-0.5">*</span>}</label>
      {children}
      {error && <p className="mt-1 text-xs text-[#C63B4E]">{error}</p>}
    </div>
  );
}

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

export default function NewNotificationCampaignPage() {
  const router = useRouter();
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/notifications\/campaigns\/new$/, "");

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: Record<string, unknown> = { name: values.name, title: values.title, body: values.body };
      if (values.targetAudience) payload.targetAudience = values.targetAudience;
      if (values.scheduledAt) payload.scheduledAt = values.scheduledAt;
      if (values.dataPayload?.trim()) payload.dataPayload = JSON.parse(values.dataPayload);
      const res = await fetch("/api/internal-admin/notification-campaigns", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create"); }
      return res.json();
    },
    onSuccess: (result) => {
      toast.success(`Campaign "${result.name ?? "created"}" saved as draft`);
      router.push(`${adminConsolePath}/notifications/campaigns/${result.id}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/notifications/campaigns`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Campaigns
        </Link>
      </div>

      <PageHeader title="New Notification Campaign" description="Create a campaign to send to a group of users" />

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-4">
        <Field label="Campaign Name" error={errors.name?.message} required>
          <input {...register("name")} className={INPUT} placeholder="e.g. Re-engagement push" />
        </Field>
        <Field label="Notification Title" error={errors.title?.message} required>
          <input {...register("title")} className={INPUT} placeholder="Notification title (shown on device)" />
        </Field>
        <Field label="Notification Body" error={errors.body?.message} required>
          <textarea {...register("body")} rows={3} className={`${INPUT} resize-none`} placeholder="Notification message body" />
        </Field>
        <Field label="Target Audience" error={errors.targetAudience?.message}>
          <select {...register("targetAudience")} className={INPUT}>
            <option value="">All users</option>
            <option value="INACTIVE_7D">Inactive 7+ days</option>
            <option value="INACTIVE_30D">Inactive 30+ days</option>
            <option value="NO_PHOTOS">No profile photos</option>
          </select>
        </Field>
        <Field label="Scheduled At" error={errors.scheduledAt?.message}>
          <input {...register("scheduledAt")} type="datetime-local" className={INPUT} />
        </Field>
        <Field label="Data payload (optional JSON)" error={errors.dataPayload?.message}>
          <textarea {...register("dataPayload")} rows={2} className={`${INPUT} font-mono resize-none`} placeholder='{"screen": "matches"}' />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <Link href={`${adminConsolePath}/notifications/campaigns`} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">Cancel</Link>
          <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50">
            {mutation.isPending ? "Saving…" : "Save as draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
