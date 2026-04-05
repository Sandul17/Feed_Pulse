import FeedbackForm from '@/components/FeedbackForm';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100 py-14 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-cyan-100/70 to-transparent" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-200/50 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Community Feedback Hub
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            FeedPulse
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Turn customer ideas into product decisions. Share bugs, requests, and improvements in one focused workflow.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Admin Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <FeedbackForm />
      </div>
    </main>
  );
}