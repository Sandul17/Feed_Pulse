'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Feedback } from '@/types';
import { CalendarDays, RefreshCw, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/feedback');
      setFeedbacks(response.data.data.feedback);
    } catch (error) {
      console.error('Failed to fetch feedbacks', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/feedback/${id}`, { status: newStatus });
      toast.success('Status updated successfully!');
      fetchFeedbacks(); // Refresh list
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };
  
  const handleReAnalyze = async (id: string) => {
    try {
      await api.post(`/feedback/${id}/re-analyze`);
      toast.success('Re-analysis triggered!');
      fetchFeedbacks(); // Refresh list
    } catch (error) {
      toast.error('Failed to re-analyze.');
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return <p className="text-slate-600">Loading feedback...</p>;
  }

  if (feedbacks.length === 0) {
    return <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">No feedback found yet.</p>;
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((item) => (
        <article key={item._id} className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-lg shadow-slate-200/70">
          <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="mt-2 text-slate-600">{item.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getSentimentColor(item.ai_sentiment)}`}>
                  {item.ai_sentiment || 'Neutral'}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  Priority: {item.ai_priority ?? 'N/A'}
                </span>
                {item.ai_tags?.map((tag, index) => (
                  <span key={`${item._id}-${tag}-${index}`} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                    {tag}
                  </span>
                ))}
              </div>

              {item.ai_summary && (
                <p className="mt-3 inline-flex items-start gap-2 rounded-lg bg-cyan-50 px-3 py-2 text-sm text-cyan-800">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong>AI Summary:</strong> {item.ai_summary}
                  </span>
                </p>
              )}
            </div>

            <div className="flex min-w-[190px] flex-row items-center gap-2 lg:flex-col lg:items-end lg:justify-start">
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(item._id, e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 lg:w-auto"
              >
                <option>New</option>
                <option>In Review</option>
                <option>Planned</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
              <button
                onClick={() => handleReAnalyze(item._id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Re-Analyze
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function getSentimentColor(sentiment?: string) {
  switch (sentiment) {
    case 'Positive':
      return 'bg-green-100 text-green-800';
    case 'Negative':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}