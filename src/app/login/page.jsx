"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import { Ticket, Mail, Lock, Loader2 } from "lucide-react";

export default function Login() {
  const { syncAuth, user, loading: authLoading } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials.");
        showToast({ message: authError.message || "Invalid credentials.", type: "error" });
        setLoading(false);
        return;
      }

      // Sync and get custom JWT
      await syncAuth();
      showToast({ message: "Signed in successfully.", type: "success" });
      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      showToast({ message: "An unexpected error occurred. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/login`,
      });

      if (result?.error) {
        throw new Error(result.error.message || "Google login failed.");
      }
    } catch (err) {
      const message = err?.message || "Google Login failed. Please try again.";
      setError(message);
      showToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-20">
      <div className="w-full max-w-md bg-(--card-bg) border border-(--card-border) p-8 rounded-2xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 text-3xl font-black text-violet-600 dark:text-violet-400">
            <Ticket className="h-8 w-8 transform -rotate-12" />
            <span>TicketBari</span>
          </Link>
          <h2 className="text-2xl font-black tracking-tight text-(--foreground)">Welcome Back</h2>
          <p className="text-xs text-(--muted)">Log in to manage your bookings and explore tickets.</p>
        </div>

        {error && (
          <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-(--foreground) uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-(--muted)" />
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl text-sm focus:outline-none focus:border-violet-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-(--foreground) uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-(--muted)" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl text-sm focus:outline-none focus:border-violet-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-sm transition-all duration-300 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-(--card-border)"></div>
          <span className="shrink mx-4 text-xs text-(--muted) uppercase font-semibold">Or continue with</span>
          <div className="grow border-t border-(--card-border)"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-2.5 px-4 border border-(--card-border) bg-(--card-bg) hover:bg-(--accent) text-(--foreground) font-semibold rounded-xl transition-all duration-300"
        >
          {/* Google Logo svg */}
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.67 0 3.2.58 4.38 1.71l3.27-3.27C17.67 1.63 14.98 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.83 2.97C6.26 7.55 8.91 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.47h6.44c-.28 1.48-1.11 2.73-2.36 3.58l3.66 2.84c2.14-1.98 3.38-4.89 3.38-8.55z"
            />
            <path
              fill="#FBBC05"
              d="M5.33 14.53c-.22-.67-.35-1.39-.35-2.13 0-.74.13-1.46.35-2.13L1.5 7.3C.54 9.22 0 11.35 0 13.6c0 2.25.54 4.38 1.5 6.3l3.83-2.97-.24-.76-1.76-1.64z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.09 0-5.74-2.51-6.67-5.43L1.5 15.88C3.39 19.73 7.35 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-xs text-(--muted)">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-violet-600 hover:underline font-semibold">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
