import DashboardLayout from '@/components/DashboardLayout';
import FeedbackList from '@/components/FeedbackList';

export default function AllFeedbackPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Feedback</h1>
        <p className="mt-2 text-gray-600">View and manage all user feedback submissions.</p>
      </div>
      <div className="mt-8">
        <FeedbackList />
      </div>
    </DashboardLayout>
  );
}
