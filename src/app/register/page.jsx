"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import { Ticket, User as UserIcon, Mail, Lock, Loader2 } from "lucide-react";

export default function Register() {
  const { syncAuth, user, loading: authLoading } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (authError) {
        setError(authError.message || "Failed to register.");
        showToast({ message: authError.message || "Failed to register.", type: "error" });
        setLoading(false);
        return;
      }

      // Sync user role and JWT
      await syncAuth();
      showToast({ message: "Account created successfully. Welcome to TicketBari!", type: "success" });
      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      showToast({ message: "An unexpected error occurred. Please try again.", type: "error" });
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
          <h2 className="text-2xl font-black tracking-tight text-(--foreground)">Create Account</h2>
          <p className="text-xs text-(--muted)">Join TicketBari today and travel stress-free.</p>
        </div>

        {error && (
          <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-(--foreground) uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-(--muted)" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl text-sm focus:outline-none focus:border-violet-600 transition-colors"
              />
            </div>
          </div>

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
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-(--muted)">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600 hover:underline font-semibold">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
