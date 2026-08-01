"use client";

import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle, Mail, Lock, Sparkles, CalendarDays, Users } from "lucide-react";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

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
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#ffffff] to-[#fff7ed] pt-24 pb-10 px-4">
      <div className="fixed inset-x-0 top-0 z-20 border-b border-line bg-white/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-end gap-3">
          <a href="#auth-form" className="rounded-2xl bg-sidebar-purple px-3 py-2 text-sm font-semibold text-white">
            Login
          </a>
          <Link href="/signup#auth-form" className="rounded-2xl border border-line bg-white px-3 py-2 text-sm font-semibold text-sidebar-purple">
            Sign up
          </Link>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center">
        <div className="overflow-hidden rounded-[2rem] bg-white/90 border border-white/70 shadow-[0_30px_80px_rgba(99,102,241,0.12)] p-10 backdrop-blur-xl">
          <div className="flex items-center gap-3 rounded-3xl bg-sidebar-purple/5 px-4 py-3 mb-8 border border-sidebar-purple/20">
            <Sparkles size={18} className="text-sidebar-purple" />
            <p className="text-sm font-semibold text-sidebar-purple">Fast, beautiful room booking for your team</p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-ink-400 mb-3">RoomBook login</p>
              <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">Sign in to manage room bookings instantly.</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink-500">
                Welcome back — your schedule, room availability, and team plans are now easy to access in one polished workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-line bg-slate-50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-purple/10 text-sidebar-purple mb-3">
                  <CalendarDays size={18} />
                </div>
                <p className="font-semibold text-ink-900">Instant booking</p>
                <p className="text-sm text-ink-500 mt-1">Find and reserve available rooms without switching apps.</p>
              </div>
              <div className="rounded-3xl border border-line bg-slate-50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-blue/10 text-sidebar-blue mb-3">
                  <Users size={18} />
                </div>
                <p className="font-semibold text-ink-900">Team-friendly</p>
                <p className="text-sm text-ink-500 mt-1">Share your booking status and keep everyone aligned.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-sidebar-purple/5 p-5 border border-sidebar-purple/20">
              <p className="text-sm text-sidebar-purple/90 font-semibold">Need a fast start?</p>
              <p className="text-sm text-ink-500 mt-2">Use your company email and jump straight into scheduling your next meeting room.</p>
            </div>
          </div>
        </div>

        <div id="auth-form" className="scroll-mt-20 relative overflow-hidden rounded-[2rem] bg-white/95 border border-line shadow-card p-8">
          <div className="absolute right-[-70px] top-[-60px] h-52 w-52 rounded-full bg-sidebar-purple/20 blur-3xl" />
          <div className="absolute left-[-60px] bottom-[-40px] h-40 w-40 rounded-full bg-sidebar-blue/10 blur-3xl" />

          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-3xl overflow-hidden shadow-soft">
                <Image src="/room.jpg" alt="RoomBook logo" fill className="object-cover" sizes="48px" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-sidebar-purple/80">RoomBook</p>
                <p className="text-sm font-semibold text-ink-900">Smart room scheduling</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <span className="rounded-full bg-sidebar-blue/10 px-3 py-1 text-sidebar-blue">Secure login</span>
              <span className="rounded-full bg-sidebar-purple/10 px-3 py-1 text-sidebar-purple">Team-ready</span>
              <span className="rounded-full bg-sidebar-orange/10 px-3 py-1 text-sidebar-orange">Quick access</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-semibold text-ink-900">Welcome back</p>
              <p className="text-sm text-ink-500">Use your work email to sign in and keep meeting rooms under control.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 relative">
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-2" htmlFor="email">
                Work email
              </label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="focus-ring w-full rounded-2xl border border-line bg-bg/60 px-14 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-brand focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="focus-ring w-full rounded-2xl border border-line bg-bg/60 px-14 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-brand focus:bg-white"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-2xl bg-category-otherBg text-category-other text-sm px-4 py-3">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="focus-ring w-full rounded-2xl bg-gradient-to-r from-sidebar-purple to-sidebar-blue px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sidebar-purple/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-ink-400 mt-6">
            New here?{' '}
            <Link href="/signup" className="text-sidebar-purple font-semibold hover:underline">
              Create an account
            </Link>
          </p>
          <div className="text-center mt-4">
            <Link
              href="/"
              className="focus-ring inline-flex w-full justify-center rounded-2xl border border-line bg-slate-100 px-4 py-3 text-sm font-semibold text-ink-700 transition hover:bg-slate-200"
            >
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
