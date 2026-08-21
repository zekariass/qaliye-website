"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { HeartHandshake, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ReconcileMatchesPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<{ matches_created: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const reconcileMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/internal-admin/matches/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 403) throw new Error("You do not have admin access.");
        if (data?.error === "admin_access_required") throw new Error("You do not have admin access.");
        throw new Error(data?.error ?? "Reconciliation failed, please try again.");
      }
      return data as { matches_created: number };
    },
    onSuccess: (data) => {
      setResult(data);
      setErrorMsg(null);
      toast.success(`Reconciliation complete: ${data.matches_created} matches created.`);
      setConfirmOpen(false);
    },
    onError: (err: Error) => {
      setErrorMsg(err.message);
      setResult(null);
      setConfirmOpen(false);
    },
  });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Match Reconciliation"
        actions={
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={reconcileMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {reconcileMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Reconciling…
              </>
            ) : (
              <>
                <HeartHandshake className="h-4 w-4" />
                Reconcile Orphaned Matches
              </>
            )}
          </button>
        }
      />

      <div className="bg-white border border-[#E5E5EA] rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3F0FF]">
            <HeartHandshake className="h-5 w-5 text-[#7C3AED]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#17171B]">What does this do?</h2>
            <p className="mt-1 text-sm text-[#666672] leading-relaxed">
              This tool scans for pairs of users who have active <span className="font-medium text-[#17171B]">LIKE</span> or{" "}
              <span className="font-medium text-[#17171B]">SUPERLIKE</span> actions toward each other but{" "}
              <span className="font-medium text-[#17171B]">no corresponding match record</span>. For each orphaned pair,
              it creates the missing match. Pairs that fail (e.g. due to a block constraint or concurrent insert) are
              silently skipped.
            </p>
          </div>
        </div>

        {result && (
          <div className="flex items-start gap-3 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl">
            <CheckCircle2 className="h-5 w-5 text-[#16815D] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#16815D]">Reconciliation complete</p>
              <p className="mt-0.5 text-sm text-[#16815D]/80">
                {result.matches_created} {result.matches_created === 1 ? "match" : "matches"} created.
                {result.matches_created === 0 && " No orphaned pairs were found."}
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-start gap-3 p-4 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl">
            <AlertCircle className="h-5 w-5 text-[#C63B4E] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#C63B4E]">Reconciliation failed</p>
              <p className="mt-0.5 text-sm text-[#C63B4E]/80">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => reconcileMutation.mutate()}
        title="Reconcile orphaned matches"
        description="This will scan for and create missing match records for mutually liked users. Continue?"
        confirmLabel="Reconcile"
        variant="default"
        isLoading={reconcileMutation.isPending}
      />
    </div>
  );
}
