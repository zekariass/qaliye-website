"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { parseInternalApiError } from "@/lib/admin/errors";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime, formatDate, formatRelative } from "@/lib/admin/dates";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import {
  RequestStatusBadge,
  IntroStatusBadge,
  DecisionBadge,
} from "@/components/admin/matchmaking/MmStatusBadges";
import {
  PersonCard,
  personMeta,
  personName,
} from "@/components/admin/matchmaking/PersonCard";
import { PreferencesGrid } from "@/components/admin/matchmaking/PreferencesGrid";
import { NotesPanel } from "@/components/admin/matchmaking/NotesPanel";
import { MatchmakerNotesEditor } from "@/components/admin/matchmaking/MatchmakerNotesEditor";
import {
  asArray,
  normIntroduction,
  normPreferences,
  normProfile,
  normRequestDetail,
  type MatchmakingPreferences,
  type ProfileCard,
} from "@/lib/admin/matchmaking-types";
import {
  ChevronLeft,
  Trash2,
  UserSearch,
  ExternalLink,
  HeartHandshake,
} from "lucide-react";

type Tab = "overview" | "preferences" | "introductions" | "notes";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "preferences", label: "Preferences" },
  { key: "introductions", label: "Introductions" },
  { key: "notes", label: "Notes" },
];

const TERMINAL: string[] = ["MATCHED", "COMPLETED", "CANCELLED", "EXPIRED"];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-xs text-[#666672] shrink-0 w-40">{label}</span>
      <span className="text-sm text-[#17171B] text-right min-w-0">{value ?? "—"}</span>
    </div>
  );
}

/** Compact preference preview for the middle workspace column. */
function PreferencesSummary({
  preferences,
  onViewAll,
}: {
  preferences: MatchmakingPreferences | null | undefined;
  onViewAll: () => void;
}) {
  const p = preferences;
  if (!p) {
    return (
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 h-full">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
          Matchmaking Preferences
        </p>
        <p className="text-sm text-[#9CA3AF]">No preferences on record.</p>
      </div>
    );
  }
  const rows: [string, string][] = [
    ["Age", p.min_age || p.max_age ? `${p.min_age ?? "?"} – ${p.max_age ?? "?"}` : "Any"],
    ["Height", p.min_height_cm || p.max_height_cm ? `${p.min_height_cm ?? "?"} – ${p.max_height_cm ?? "?"} cm` : "Any"],
    ["Location", p.specific_country_codes?.length ? p.specific_country_codes.join(", ") : "Any"],
    ["Religion", p.religion_preferences?.length ? p.religion_preferences.map((s) => s.replace(/_/g, " ")).join(", ") : "Any"],
    ["Education", p.education_levels?.length ? p.education_levels.map((s) => s.replace(/_/g, " ")).join(", ") : "Any"],
    ["Marriage", p.marriage_timeline ? p.marriage_timeline.replace(/_/g, " ") : "—"],
    ["Long distance", p.long_distance_relationship ?? "—"],
    ["Family", p.family_involvement ?? "—"],
    ["Religion important", p.religion_important ?? "—"],
    ["Relocate", p.willing_to_relocate ?? "—"],
  ];
  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 h-full flex flex-col">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
        Matchmaking Preferences
      </p>
      <div className="flex-1">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 py-1.5 border-b border-[#F2F2F5] last:border-0">
            <span className="text-xs text-[#666672]">{k}</span>
            <span className="text-xs font-medium text-[#17171B] text-right">{v}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="mt-4 text-xs font-medium text-[#7C3AED] hover:underline self-start"
      >
        View Preferences →
      </button>
    </div>
  );
}

export default function RequestWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const adminConsolePath = pathname.replace(/\/matchmaking.*$/, "");
  const mm = `${adminConsolePath}/matchmaking`;

  const [tab, setTab] = useState<Tab>("overview");
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: detail, isLoading, isError, refetch } = useQuery({
    queryKey: adminKeys.matchmaking.requests.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/requests/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return normRequestDetail(await res.json());
    },
    staleTime: 0,
    refetchInterval: 30_000,
  });

  const { data: introductions = [], isLoading: introsLoading } = useQuery({
    queryKey: adminKeys.matchmaking.introductions.forRequest(id),
    queryFn: async () => {
      const res = await fetch(
        `/api/internal-admin/matchmaking/requests/${id}/introductions`,
        { cache: "no-store" }
      );
      if (!res.ok) return [];
      return asArray<unknown>(await res.json()).map(normIntroduction);
    },
    staleTime: 0,
    enabled: !!detail,
  });

  // GET /requests/{id} returns a bare RequestRow — fetch the requester's
  // profile card and live preferences from their own endpoints.
  const requestUserId = detail?.request.user_id;
  const { data: requesterProfile } = useQuery<ProfileCard | null>({
    queryKey: ["mm-requester-profile", requestUserId],
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/users/${requestUserId}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      return normProfile(await res.json());
    },
    enabled: !!detail && !detail.profile && !!requestUserId,
    staleTime: 60_000,
  });

  const { data: livePreferences } = useQuery<MatchmakingPreferences | null>({
    queryKey: ["mm-requester-prefs", requestUserId],
    queryFn: async () => {
      const res = await fetch(
        `/api/internal-admin/matchmaking/users/${requestUserId}/matchmaking-preferences`,
        { cache: "no-store" }
      );
      if (!res.ok) return null;
      return normPreferences(await res.json());
    },
    enabled: !!detail && !detail.preferences && !!requestUserId,
    staleTime: 60_000,
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await parseInternalApiError(res);
        if (err.status === 409) {
          await queryClient.invalidateQueries({
            queryKey: adminKeys.matchmaking.requests.detail(id),
          });
        }
        throw err;
      }
    },
    onSuccess: () => {
      toast.success("Matchmaking request cancelled");
      setCancelOpen(false);
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.requests.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.introductions.forRequest(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.stats() });
    },
    onError: (e: Error) => {
      toast.error(e.message);
      setCancelOpen(false);
    },
  });

  if (isLoading) return <PageSkeleton rows={6} />;
  if (isError || !detail) return <ErrorState onRetry={refetch} />;

  const request = detail.request;
  const profile: ProfileCard | null = detail.profile ?? requesterProfile ?? null;
  const preferences = detail.preferences ?? livePreferences ?? null;
  const isTerminal = TERMINAL.includes(request.status);
  const canCancel = !isTerminal;
  const name = personName(profile);
  const meta = personMeta(profile);

  return (
    <div>
      <div className="mb-4">
        <Link
          href={`${mm}/requests`}
          className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]"
        >
          <ChevronLeft className="h-4 w-4" /> Matchmaking Requests
        </Link>
      </div>

      <PageHeader
        title={name}
        description={meta || `Request ${request.id}`}
        badge={<RequestStatusBadge status={request.status} />}
        actions={
          <div className="flex items-center gap-2">
            {request.status === "OPEN" && (
              <Link
                href={`${mm}/requests/${id}/candidates`}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
              >
                <UserSearch className="h-4 w-4" /> Find Candidates
              </Link>
            )}
            {canCancel && (
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl transition-colors"
              >
                <Trash2 className="h-4 w-4" /> Cancel Request
              </button>
            )}
          </div>
        }
      />

      {/* Three-part workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="relative">
          <PersonCard profile={profile} title="Requester Profile" />
          <Link
            href={`${adminConsolePath}/users/${request.user_id}`}
            className="mt-3 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-[#666672] bg-white border border-[#E5E5EA] hover:bg-[#F7F7FA] rounded-xl transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> View Full Profile
          </Link>
        </div>

        <PreferencesSummary
          preferences={preferences}
          onViewAll={() => setTab("preferences")}
        />

        <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
            Notes
          </p>
          <NotesPanel requestId={id} collapsible />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E5EA] flex gap-1 mb-4 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-[#7C3AED] text-[#7C3AED]"
                : "border-transparent text-[#666672] hover:text-[#17171B]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
        {tab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">
                Request
              </p>
              <Row label="Request ID" value={<CopyIdButton id={request.id} />} />
              <Row label="Status" value={<RequestStatusBadge status={request.status} />} />
              <Row label="Created" value={formatDateTime(request.created_at)} />
              <Row label="Updated" value={formatDateTime(request.updated_at)} />
              <Row
                label="Expires"
                value={
                  <span title={formatDateTime(request.expires_at)}>
                    {formatRelative(request.expires_at)}
                  </span>
                }
              />
              {request.completed_at && (
                <Row label="Completed" value={formatDateTime(request.completed_at)} />
              )}
              {request.cancelled_at && (
                <Row label="Cancelled" value={formatDateTime(request.cancelled_at)} />
              )}
              {request.contact_phone && (
                <Row label="Contact phone" value={request.contact_phone} />
              )}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">
                Requester
              </p>
              <Row
                label="User"
                value={
                  <Link
                    href={`${adminConsolePath}/users/${request.user_id}`}
                    className="text-[#7C3AED] hover:underline"
                  >
                    {name}
                  </Link>
                }
              />
              <Row label="User ID" value={<CopyIdButton id={request.user_id} />} />
              <Row
                label="Introductions"
                value={
                  <span className="inline-flex items-center gap-1">
                    <HeartHandshake className="h-3.5 w-3.5 text-[#9CA3AF]" />
                    {introductions.length} created
                  </span>
                }
              />
            </div>
          </div>
        )}

        {tab === "preferences" && (
          <div className="max-w-2xl">
            <p className="text-xs text-[#9CA3AF] mb-4">
              The requester&apos;s current matchmaking preferences — always evaluated live, never snapshotted.
            </p>
            <PreferencesGrid preferences={preferences} />
          </div>
        )}

        {tab === "introductions" && (
          <div className="space-y-3">
            {introsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-14 bg-[#E5E5EA] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : introductions.length === 0 ? (
              <p className="text-sm text-[#9CA3AF] text-center py-6">
                No introductions yet for this request.
              </p>
            ) : (
              introductions.map((intro) => (
                <Link
                  key={intro.id}
                  href={`${mm}/introductions/${intro.id}`}
                  className="flex items-center gap-3 p-3 border border-[#E5E5EA] rounded-xl hover:bg-[#F7F7FA] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-[#17171B] truncate">{intro.id}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {intro.proposed_at ? `Proposed ${formatDate(intro.proposed_at)}` : ""}
                      {intro.overall_percentage != null && ` · ${intro.overall_percentage}% overall`}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-[#666672]">
                    <DecisionBadge decision={intro.requester_decision} />
                    <DecisionBadge decision={intro.candidate_decision} />
                  </div>
                  <IntroStatusBadge status={intro.status} />
                </Link>
              ))
            )}
          </div>
        )}

        {tab === "notes" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-[#17171B] mb-3">Request notes</h3>
              <NotesPanel requestId={id} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#17171B] mb-3">
                Matchmaker notes (preferences)
              </h3>
              <MatchmakerNotesEditor
                userId={request.user_id}
                initialNotes={preferences?.matchmaker_notes}
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancel matchmaking request?"
        description={`${name === "Unknown user" ? "This request" : `${name}'s request`} will be cancelled. Any active proposed introduction involving this request will also be cancelled.`}
        confirmLabel="Cancel Request"
        cancelLabel="Keep Request"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
