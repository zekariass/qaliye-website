"use client";

import { useState } from "react";
import type { ProfileCard } from "@/lib/admin/matchmaking-types";
import { BadgeCheck, MapPin, User } from "lucide-react";

export function personLocation(p: ProfileCard | null | undefined): string {
  if (!p) return "—";
  const place = p.country_name ?? p.country_code;
  return [p.city ?? p.region, place].filter(Boolean).join(", ") || "—";
}

export function personName(p: ProfileCard | null | undefined): string {
  return p?.display_name || "Unknown user";
}

export function personMeta(p: ProfileCard | null | undefined): string {
  if (!p) return "";
  const bits: string[] = [];
  if (p.age) bits.push(String(p.age));
  const loc = personLocation(p);
  if (loc !== "—") bits.push(loc);
  return bits.join(" · ");
}

function initials(name?: string): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]!.toUpperCase())
    .join("");
}

export function PersonAvatar({
  profile,
  size = "md",
}: {
  profile: ProfileCard | null | undefined;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const [broken, setBroken] = useState(false);
  const dims = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl",
  }[size];
  const url = profile?.primary_photo_url;

  if (url && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={personName(profile)}
        onError={() => setBroken(true)}
        className={`${dims} rounded-full object-cover shrink-0 bg-[#EDE2FF]`}
      />
    );
  }
  return (
    <div
      className={`${dims} rounded-full bg-[#EDE2FF] flex items-center justify-center shrink-0 font-semibold text-[#7C3AED]`}
    >
      {profile?.display_name ? (
        initials(profile.display_name)
      ) : (
        <User className="h-1/2 w-1/2" />
      )}
    </div>
  );
}

/** Compact avatar + name + meta line used in tables and list rows. */
export function PersonInline({ profile }: { profile: ProfileCard | null | undefined }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <PersonAvatar profile={profile} size="sm" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#17171B] truncate flex items-center gap-1">
          {personName(profile)}
          {profile?.is_verified && (
            <BadgeCheck className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
          )}
        </p>
        <p className="text-xs text-[#666672] truncate">{personMeta(profile) || "—"}</p>
      </div>
    </div>
  );
}

/** Elegant requester/candidate card used on workspace and review screens. */
export function PersonCard({
  profile,
  title,
}: {
  profile: ProfileCard | null | undefined;
  title?: string;
}) {
  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 text-center">
      {title && (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
          {title}
        </p>
      )}
      <div className="flex justify-center">
        <PersonAvatar profile={profile} size="xl" />
      </div>
      <p className="mt-3 text-base font-semibold text-[#17171B] flex items-center justify-center gap-1.5">
        {personName(profile)}
        {profile?.is_verified && (
          <BadgeCheck className="h-4 w-4 text-[#2563EB] shrink-0" />
        )}
      </p>
      <p className="text-sm text-[#666672]">
        {[profile?.age ? `${profile.age}` : null, profile?.gender ? profile.gender.replace(/_/g, " ") : null]
          .filter(Boolean)
          .join(" · ") || "—"}
      </p>
      {(profile?.city || profile?.region || profile?.country_name || profile?.country_code) && (
        <p className="mt-1 text-xs text-[#9CA3AF] flex items-center justify-center gap-1">
          <MapPin className="h-3 w-3" />
          {personLocation(profile)}
        </p>
      )}
      {profile?.occupation && (
        <p className="mt-1 text-xs text-[#666672]">{profile.occupation}</p>
      )}
      {profile?.is_verified && (
        <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#16815D] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
          <BadgeCheck className="h-3 w-3" /> Verified
        </p>
      )}
    </div>
  );
}
