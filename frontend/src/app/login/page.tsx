import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md items-center">
        <div className="w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center justify-center">
              <h1 className="text-4xl font-black tracking-tight text-indigo-600">FeedPulse</h1>
            </Link>
            <p className="mt-2 text-sm text-slate-600">Admin access for feedback insights and workflow updates</p>
          </div>

          <LoginForm />

          <div className="text-center">
            <Link href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
              Back to Feedback Form
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}