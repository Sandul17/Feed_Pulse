'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { MessageSquare, TrendingUp } from 'lucide-react';

interface Stats {
  totalFeedback: number;
  new: number;
  inReview: number;
  planned: number;
  inProgress: number;
  resolved: number;
  closed: number;
  avgPriority: number;
}

const STATUSES = [
  { key: 'new', label: 'New', color: 'from-blue-500 to-blue-600', textColor: 'text-blue-100' },
  { key: 'inReview', label: 'In Review', color: 'from-yellow-500 to-yellow-600', textColor: 'text-yellow-100' },
  { key: 'planned', label: 'Planned', color: 'from-purple-500 to-purple-600', textColor: 'text-purple-100' },
  { key: 'inProgress', label: 'In Progress', color: 'from-indigo-500 to-indigo-600', textColor: 'text-indigo-100' },
  { key: 'resolved', label: 'Resolved', color: 'from-green-500 to-green-600', textColor: 'text-green-100' },
  { key: 'closed', label: 'Closed', color: 'from-gray-500 to-gray-600', textColor: 'text-gray-100' },
];

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/feedback');
        if (response.data.success && response.data.data.feedback) {
          const feedbacks = response.data.data.feedback;
          
          const totalFeedback = feedbacks.length;
          const newCount = feedbacks.filter((f: any) => f.status === 'New').length;
          const inReviewCount = feedbacks.filter((f: any) => f.status === 'In Review').length;
          const plannedCount = feedbacks.filter((f: any) => f.status === 'Planned').length;
          const inProgressCount = feedbacks.filter((f: any) => f.status === 'In Progress').length;
          const resolvedCount = feedbacks.filter((f: any) => f.status === 'Resolved').length;
          const closedCount = feedbacks.filter((f: any) => f.status === 'Closed').length;
          const avgPriority = feedbacks.length > 0 
            ? (feedbacks.reduce((sum: number, f: any) => sum + (f.ai_priority || 0), 0) / feedbacks.length).toFixed(1)
            : 0;

          setStats({
            totalFeedback,
            new: newCount,
            inReview: inReviewCount,
            planned: plannedCount,
            inProgress: inProgressCount,
            resolved: resolvedCount,
            closed: closedCount,
            avgPriority: Number(avgPriority)
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Feedback</p>
              <p className="text-3xl font-bold mt-2">{stats.totalFeedback}</p>
            </div>
            <MessageSquare className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Priority</p>
              <p className="text-3xl font-bold mt-2">{stats.avgPriority}/10</p>
            </div>
            <TrendingUp className="h-12 w-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Status Grid */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {STATUSES.map((status) => (
            <div key={status.key} className={`bg-gradient-to-br ${status.color} text-white p-4 rounded-lg shadow`}>
              <p className={`${status.textColor} text-sm font-medium`}>{status.label}</p>
              <p className="text-2xl font-bold mt-2">{stats[status.key as keyof Stats] || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
