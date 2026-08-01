"use client";

import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle, Mail, Lock, User, Sparkles, DoorOpen } from "lucide-react";

export default function SignupPage() {
  const { signup, user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
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
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      router.push("/");
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code.includes("email-already-in-use")) {
        setError("An account with that email already exists.");
      } else {
        setError("We couldn't create your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7ed] via-[#ffffff] to-[#eef2ff] pt-24 pb-10 px-4">
      <div className="fixed inset-x-0 top-0 z-20 border-b border-line bg-white/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-end gap-3">
          <Link href="/login#auth-form" className="rounded-2xl border border-line bg-white px-3 py-2 text-sm font-semibold text-sidebar-blue">
            Login
          </Link>
          <a href="#auth-form" className="rounded-2xl bg-sidebar-blue px-3 py-2 text-sm font-semibold text-white">
            Sign up
          </a>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] items-center">
        <div className="overflow-hidden rounded-[2rem] bg-white/90 border border-white/70 shadow-[0_30px_80px_rgba(59,130,246,0.12)] p-10 backdrop-blur-xl">
          <div className="flex items-center gap-3 rounded-3xl bg-sidebar-blue/5 px-4 py-3 mb-8 border border-sidebar-blue/20">
            <Sparkles size={18} className="text-sidebar-blue" />
            <p className="text-sm font-semibold text-sidebar-blue">Create your team’s room booking account</p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-ink-400 mb-3">Team scheduling</p>
              <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">Start booking rooms with confidence.</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink-500">
                Create your account and get fast access to your workspace schedule, room availability, and booking history.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-line bg-slate-50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-orange/10 text-sidebar-orange mb-3">
                  <DoorOpen size={18} />
                </div>
                <p className="font-semibold text-ink-900">Fast setup</p>
                <p className="text-sm text-ink-500 mt-1">Create your account and start reserving rooms in seconds.</p>
              </div>
              <div className="rounded-3xl border border-line bg-slate-50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-purple/10 text-sidebar-purple mb-3">
                  <User size={18} />
                </div>
                <p className="font-semibold text-ink-900">Personal profile</p>
                <p className="text-sm text-ink-500 mt-1">Book rooms under your own account and keep your bookings private.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-sidebar-blue/5 p-5 border border-sidebar-blue/20">
              <p className="text-sm text-sidebar-blue/90 font-semibold">Keep things organized</p>
              <p className="text-sm text-ink-500 mt-2">Every booking is tied to your profile, so only you can edit or cancel your reservations.</p>
            </div>
          </div>
        </div>

        <div id="auth-form" className="scroll-mt-20 relative overflow-hidden rounded-[2rem] bg-white/95 border border-line shadow-card p-8">
          <div className="absolute left-[-70px] top-[-60px] h-52 w-52 rounded-full bg-sidebar-blue/20 blur-3xl" />
          <div className="absolute right-[-60px] bottom-[-40px] h-40 w-40 rounded-full bg-sidebar-orange/10 blur-3xl" />

          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-3xl overflow-hidden shadow-soft">
                <Image src="/room.jpg" alt="RoomBook logo" fill className="object-cover" sizes="48px" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-sidebar-blue/80">RoomBook</p>
                <p className="text-sm font-semibold text-ink-900">Reserve rooms in one place</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <span className="rounded-full bg-sidebar-purple/10 px-3 py-1 text-sidebar-purple">Secure</span>
              <span className="rounded-full bg-sidebar-blue/10 px-3 py-1 text-sidebar-blue">Team-ready</span>
              <span className="rounded-full bg-sidebar-orange/10 px-3 py-1 text-sidebar-orange">Fast</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-semibold text-ink-900">Create your account</p>
              <p className="text-sm text-ink-500">Sign up now and keep your workspace bookings organized in one easy place.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 relative">
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-2" htmlFor="name">
                Full name
              </label>
              <div className="relative">
                <User size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Cooper"
                  className="focus-ring w-full rounded-2xl border border-line bg-bg/60 px-14 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-brand focus:bg-white"
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
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
              className="focus-ring w-full rounded-2xl bg-gradient-to-r from-sidebar-blue to-sidebar-purple px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sidebar-blue/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-ink-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-sidebar-blue font-semibold hover:underline">
              Sign in
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
