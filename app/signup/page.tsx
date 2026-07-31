"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle, Mail, Lock, User } from "lucide-react";

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
      } else if (code.includes("invalid-email")) {
        setError("Please enter a valid email address.");
      } else if (code.includes("weak-password")) {
        setError("Password is too weak.");
      } else {
        setError("We couldn't create your account. Please try again.");
      }
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
          <span className="font-semibold text-ink-900 text-lg">
            RoomBook
          </span>
        </div>

        <div className="bg-card rounded-3xl shadow-card p-7">
          <h1 className="text-xl font-semibold text-ink-900 mb-1">
            Create your account
          </h1>

          <p className="text-sm text-ink-400 mb-6">
            Set up access to book meeting rooms and halls.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label
                className="block text-xs font-semibold text-ink-500 mb-1.5"
                htmlFor="name"
              >
                Full name
              </label>

              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                />

                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Cooper"
                  className="focus-ring w-full rounded-xl border border-line bg-bg/60 pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-brand focus:bg-white transition-colors"
                />
              </div>
            </div>


            <div>
              <label
                className="block text-xs font-semibold text-ink-500 mb-1.5"
                htmlFor="email"
              >
                Work email
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                />

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
              <label
                className="block text-xs font-semibold text-ink-500 mb-1.5"
                htmlFor="password"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                />

                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              {loading ? "Creating account…" : "Create account"}
            </button>

          </form>
        </div>


        <p className="text-center text-sm text-ink-400 mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}