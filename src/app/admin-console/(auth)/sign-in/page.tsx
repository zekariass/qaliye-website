"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.48 10.12v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.52.307 12.24c0 6.72 5.56 12.24 12.173 12.24 3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminConsolePath =
    typeof window !== "undefined"
      ? window.location.pathname.replace(/\/sign-in\/?$/, "")
      : "";

  useEffect(() => {
    if (errorParam === "auth") {
      setError("Google sign-in failed. Please try again.");
    }
  }, [errorParam]);

  async function handleGoogleSignIn() {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const destination = nextPath && nextPath.startsWith(adminConsolePath)
        ? nextPath
        : adminConsolePath + "/";

      document.cookie = `admin_oauth_next=${encodeURIComponent(destination)}; path=/; max-age=600; samesite=lax`;

      const redirectTo = `${window.location.origin}/api/auth/callback`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (oauthError) {
        setError(oauthError.message ?? "Google sign-in failed.");
        setIsGoogleLoading(false);
      }
    } catch {
      setError("Network error during Google sign-in.");
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/internal-admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
          response.status === 401
            ? "Incorrect email or password."
            : body.message ?? "Sign-in failed. Please try again.";
        setError(msg);
        return;
      }

      const destination = nextPath && nextPath.startsWith(adminConsolePath)
        ? nextPath
        : adminConsolePath + "/";
      router.push(destination);
      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm p-7">
        <h2 className="text-base font-semibold text-[#17171B] mb-5">Sign in to continue</h2>

        {error && (
          <div className="flex items-start gap-2.5 mb-4 p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl text-sm text-[#C63B4E]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 text-sm font-medium text-[#17171B] bg-white border border-[#E5E5EA] hover:bg-[#F7F7FA] rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-4"
        >
          {isGoogleLoading ? (
            <span className="h-4 w-4 border-2 border-[#9CA3AF] border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {isGoogleLoading ? "Connecting…" : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#E5E5EA]" />
          <span className="text-xs text-[#9CA3AF]">or</span>
          <div className="flex-1 h-px bg-[#E5E5EA]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-[#17171B] mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-[#E5E5EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] disabled:opacity-60 disabled:bg-[#F7F7FA]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-[#17171B] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-[#E5E5EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] disabled:opacity-60 disabled:bg-[#F7F7FA]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#666672]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6] rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-xs text-[#9CA3AF]">
        Authorised personnel only. All actions are audited.
      </p>
    </div>
  );
}

export default function AdminSignInPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm p-7 animate-pulse">
          <div className="h-5 w-40 bg-[#E5E5EA] rounded mb-5" />
          <div className="h-10 bg-[#E5E5EA] rounded-xl mb-4" />
          <div className="h-10 bg-[#E5E5EA] rounded-xl mb-4" />
          <div className="h-10 bg-[#E5E5EA] rounded-xl" />
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
