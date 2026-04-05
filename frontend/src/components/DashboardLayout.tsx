'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { LogOut, BarChart3, MessageSquare } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        await api.get('/feedback'); // A simple check to see if token is valid
        setIsLoading(false);
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-md flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-600">FeedPulse</h2>
        </div>
        <nav className="mt-6 flex-1">
          <a href="/dashboard" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <BarChart3 className="mr-3 h-5 w-5" />
            Dashboard
          </a>
          <a href="/dashboard/all-feedback" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <MessageSquare className="mr-3 h-5 w-5" />
            All Feedback
          </a>
        </nav>
        <div className="p-6">
          <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-red-600">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
      <main className="min-h-screen p-8 ml-64">
        {children}
      </main>
    </div>
  );
}