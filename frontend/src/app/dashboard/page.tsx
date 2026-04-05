import DashboardLayout from '@/components/DashboardLayout';
import DashboardStats from '@/components/DashboardStats';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Track feedback trends and status distribution.</p>
      </div>
      <div className="mt-8">
        <DashboardStats />
      </div>
    </DashboardLayout>
  );
}