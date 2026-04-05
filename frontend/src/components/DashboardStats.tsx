'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { MessageSquare, TrendingUp } from 'lucide-react';
import { Feedback } from '@/types';

interface Stats {
	totalFeedback: number;
	newCount: number;
	inReviewCount: number;
	plannedCount: number;
	inProgressCount: number;
	resolvedCount: number;
	closedCount: number;
	avgPriority: number;
}

export default function DashboardStats() {
	const [stats, setStats] = useState<Stats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await api.get('/feedback');
				const feedbacks: Feedback[] = response.data?.data?.feedback || [];

				const totalFeedback = feedbacks.length;
				const newCount = feedbacks.filter((f) => f.status === 'New').length;
				const inReviewCount = feedbacks.filter((f) => f.status === 'In Review').length;
				const plannedCount = feedbacks.filter((f) => f.status === 'Planned').length;
				const inProgressCount = feedbacks.filter((f) => f.status === 'In Progress').length;
				const resolvedCount = feedbacks.filter((f) => f.status === 'Resolved').length;
				const closedCount = feedbacks.filter((f) => f.status === 'Closed').length;

				const avgPriority =
					totalFeedback > 0
						? Number(
								(
									feedbacks.reduce((sum, item) => sum + (item.ai_priority || 0), 0) /
									totalFeedback
								).toFixed(1)
							)
						: 0;

				setStats({
					totalFeedback,
					newCount,
					inReviewCount,
					plannedCount,
					inProgressCount,
					resolvedCount,
					closedCount,
					avgPriority,
				});
			} catch (error) {
				console.error('Failed to load dashboard stats:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) {
		return <p className="text-gray-600">Loading dashboard stats...</p>;
	}

	if (!stats) {
		return <p className="text-red-600">Unable to load dashboard stats.</p>;
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-md">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-blue-100">Total Feedback</p>
							<p className="mt-2 text-3xl font-bold">{stats.totalFeedback}</p>
						</div>
						<MessageSquare className="h-10 w-10 opacity-90" />
					</div>
				</div>
				<div className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 p-6 text-white shadow-md">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-emerald-100">Average Priority</p>
							<p className="mt-2 text-3xl font-bold">{stats.avgPriority}/10</p>
						</div>
						<TrendingUp className="h-10 w-10 opacity-90" />
					</div>
				</div>
			</div>

			<div className="rounded-xl border bg-white p-6 shadow-sm">
				<h2 className="text-lg font-semibold text-gray-900">Status Breakdown</h2>
				<p className="mt-1 text-sm text-gray-600">All feedback statuses in one view.</p>
				<div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
					<StatusCard label="New" count={stats.newCount} color="bg-blue-50 text-blue-700 border-blue-200" />
					<StatusCard label="In Review" count={stats.inReviewCount} color="bg-amber-50 text-amber-700 border-amber-200" />
					<StatusCard label="Planned" count={stats.plannedCount} color="bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" />
					<StatusCard label="In Progress" count={stats.inProgressCount} color="bg-indigo-50 text-indigo-700 border-indigo-200" />
					<StatusCard label="Resolved" count={stats.resolvedCount} color="bg-green-50 text-green-700 border-green-200" />
					<StatusCard label="Closed" count={stats.closedCount} color="bg-slate-50 text-slate-700 border-slate-200" />
				</div>
			</div>
		</div>
	);
}

function StatusCard({ label, count, color }: { label: string; count: number; color: string }) {
	return (
		<div className={`rounded-lg border p-4 ${color}`}>
			<p className="text-sm font-medium">{label}</p>
			<p className="mt-1 text-2xl font-bold">{count}</p>
		</div>
	);
}
