import FeedbackForm from '@/components/FeedbackForm';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            FeedPulse
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Your feedback drives our product. Help us improve by sharing your thoughts.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Admin Login →
          </Link>
        </div>
        <FeedbackForm />
      </div>
    </main>
  );
}