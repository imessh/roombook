"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) router.replace("/");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("We couldn't sign you in. Check your email and password and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-11 h-11 rounded-2xl bg-brand text-white flex items-center justify-center font-bold text-lg shadow-soft">
            R
          </div>
          <span className="font-semibold text-ink-900 text-lg">RoomBook</span>
        </div>

        <div className="bg-card rounded-3xl shadow-card p-7">
          <h1 className="text-xl font-semibold text-ink-900 mb-1">Welcome back</h1>
          <p className="text-sm text-ink-400 mb-6">Sign in with your work email to reserve a room.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1.5" htmlFor="email">
                Work email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="focus-ring w-full rounded-xl border border-line bg-bg/60 pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-brand focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="focus-ring w-full rounded-xl border border-line bg-bg/60 pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-brand focus:bg-white transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-category-otherBg text-category-other text-sm px-3.5 py-2.5">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="focus-ring w-full rounded-xl bg-brand text-white font-medium text-sm py-2.5 hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-400 mt-5">
          New here?{" "}
          <Link href="/signup" className="text-brand font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
