import { redirect } from "next/navigation";

export default function MatchmakingIndexPage() {
  const adminConsolePath = process.env.ADMIN_CONSOLE_PATH ?? "";
  redirect(`${adminConsolePath}/matchmaking/requests`);
}
