import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-indigo-600">FeedPulse</h1>
          </Link>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}