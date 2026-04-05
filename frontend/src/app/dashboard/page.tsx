import DashboardLayout from '@/components/DashboardLayout';
import FeedbackList from '@/components/FeedbackList';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Review and manage user feedback.</p>
      </div>
      <div className="mt-8">
        <FeedbackList />
      </div>
    </DashboardLayout>
  );
}