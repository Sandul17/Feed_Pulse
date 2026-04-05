import DashboardLayout from '@/components/DashboardLayout';
import FeedbackList from '@/components/FeedbackList';
import { Inbox } from 'lucide-react';

export default function AllFeedbackPage() {
  return (
    <DashboardLayout>
      <header className="mb-8 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-lg shadow-slate-200/70">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
          <Inbox className="h-3.5 w-3.5" />
          Feedback Queue
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">All Feedback</h1>
        <p className="mt-2 text-slate-600">Review submissions, update status, and trigger AI re-analysis when needed.</p>
      </header>

      <FeedbackList />
    </DashboardLayout>
  );
}
