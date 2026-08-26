"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { NavigationPayloadEditor, validateNavigationPayload } from "@/components/admin/notifications/NavigationPayloadEditor";
import { AudienceDefinitionEditor, validateAudienceDefinition } from "@/components/admin/notifications/AudienceDefinitionEditor";
import { InternalApiError, parseInternalApiError, parseValidationFieldErrors } from "@/lib/admin/errors";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  campaignKey: z
    .string()
    .min(1, "Campaign key is required")
    .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers and underscores only"),
  title: z.string().min(1, "Title is required").max(120, "Title must be at most 120 characters"),
  body: z.string().min(1, "Body is required").max(300, "Body must be at most 300 characters"),
  navigationPayload: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      const err = validateNavigationPayload(val ?? "");
      if (err) ctx.addIssue({ code: "custom", message: err });
    }),
  audienceDefinition: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      const err = validateAudienceDefinition(val ?? "");
      if (err) ctx.addIssue({ code: "custom", message: err });
    }),
});

type FormValues = z.infer<typeof schema>;

function Field({
  label, hint, error, required, children,
}: {
  label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#17171B] mb-1.5">
        {label}{required && <span className="text-[#C63B4E] ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-[#666672] mb-1.5">{hint}</p>}
      {children}
      {error && <p className="mt-1 text-xs text-[#C63B4E]">{error}</p>}
    </div>
  );
}

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value?.length ?? 0;
  return (
    <span className={`text-xs tabular-nums ${len > max ? "text-[#C63B4E]" : "text-[#666672]"}`}>
      {len}/{max}
    </span>
  );
}

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

export default function NewNotificationCampaignPage() {
  const router = useRouter();
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/notifications\/campaigns\/new$/, "");

  const { register, handleSubmit, watch, control, setError, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { navigationPayload: "{}", audienceDefinition: "{}" },
  });

  const titleValue = watch("title") ?? "";
  const bodyValue = watch("body") ?? "";

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const navStr = values.navigationPayload?.trim();
      const audStr = values.audienceDefinition?.trim();
      const payload: Record<string, unknown> = {
        campaignKey: values.campaignKey,
        title: values.title,
        body: values.body,
      };
      if (navStr && navStr !== "{}") payload.navigationPayload = JSON.parse(navStr);
      payload.audienceDefinition = audStr && audStr !== "{}" ? JSON.parse(audStr) : {};
      const res = await fetch("/api/internal-admin/notification-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw await parseInternalApiError(res);
      return res.json();
    },
    onSuccess: (result) => {
      toast.success(`Campaign "${result.title ?? "created"}" saved as draft`);
      router.push(`${adminConsolePath}/notifications/campaigns/${result.id}`);
    },
    onError: (err: Error) => {
      if (err instanceof InternalApiError) {
        if (err.status === 401) {
          router.push(`${adminConsolePath}/sign-in`);
          return;
        }
        if (err.code === "VALIDATION_ERROR") {
          const fieldErrors = parseValidationFieldErrors(err.message);
          let mapped = 0;
          for (const [field, message] of Object.entries(fieldErrors)) {
            setError(field as keyof FormValues, { message });
            mapped++;
          }
          if (mapped > 0) {
            toast.error("Please fix the highlighted fields.");
          } else {
            toast.error(err.message);
          }
          return;
        }
        if (err.code === "FORBIDDEN") {
          toast.error("You do not have permission to perform this action.");
          return;
        }
      }
      toast.error(err.message);
    },
  });

  return (
    <div className="max-w-xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/notifications/campaigns`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Campaigns
        </Link>
      </div>

      <PageHeader title="New Notification Campaign" description="Create a push notification campaign to send to users" />

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-5">
        <Field label="Campaign Key" hint="Unique identifier, e.g. summer_promo_2025" error={errors.campaignKey?.message} required>
          <input {...register("campaignKey")} className={INPUT} placeholder="e.g. re_engagement_aug_2025" />
        </Field>

        <Field label="Notification Title" error={errors.title?.message} required>
          <input {...register("title")} className={INPUT} placeholder="Title shown on the device" />
          <div className="flex justify-end mt-1"><CharCounter value={titleValue} max={120} /></div>
        </Field>

        <Field label="Notification Body" error={errors.body?.message} required>
          <textarea {...register("body")} rows={3} className={`${INPUT} resize-none`} placeholder="Notification message body" />
          <div className="flex justify-end mt-1"><CharCounter value={bodyValue} max={300} /></div>
        </Field>

        {/* Navigation Payload — structured editor */}
        <div>
          <p className="text-xs font-medium text-[#17171B] mb-1.5">Navigation Payload</p>
          <p className="text-xs text-[#666672] mb-3">Choose which screen the app opens when a user taps this notification.</p>
          <Controller
            name="navigationPayload"
            control={control}
            render={({ field, fieldState }) => (
              <NavigationPayloadEditor
                value={field.value ?? "{}"}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Audience Definition — structured editor */}
        <div>
          <Controller
            name="audienceDefinition"
            control={control}
            render={({ field, fieldState }) => (
              <AudienceDefinitionEditor
                value={field.value ?? "{}"}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link href={`${adminConsolePath}/notifications/campaigns`} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">
            Cancel
          </Link>
          <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50">
            {mutation.isPending ? "Saving…" : "Save as draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
