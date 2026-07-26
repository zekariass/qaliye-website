import {
  format,
  formatDistanceToNow,
  parseISO,
  isValid,
  differenceInDays,
} from "date-fns";

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = parseISO(iso);
  if (!isValid(date)) return "Invalid date";
  return format(date, "dd MMM yyyy, HH:mm");
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = parseISO(iso);
  if (!isValid(date)) return "Invalid date";
  return format(date, "dd MMM yyyy");
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = parseISO(iso);
  if (!isValid(date)) return "Invalid date";
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatDateTimeFull(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = parseISO(iso);
  if (!isValid(date)) return "Invalid date";
  return format(date, "EEEE, dd MMMM yyyy 'at' HH:mm:ss");
}

export function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const date = parseISO(iso);
  if (!isValid(date)) return null;
  return differenceInDays(new Date(), date);
}

export function toIsoString(date: Date): string {
  return date.toISOString();
}
