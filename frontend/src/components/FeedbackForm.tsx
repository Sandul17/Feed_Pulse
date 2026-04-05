'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { CircleHelp, Lightbulb, MessageSquareText, Send } from 'lucide-react';

const feedbackSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.enum(['Bug', 'Feature Request', 'Improvement', 'Other']),
  submitterName: z.string().optional(),
  submitterEmail: z.string().email().optional().or(z.literal('')),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const descriptionValue = watch('description', '');
  const minDescriptionLength = 10;
  const progress = Math.min(100, Math.round((descriptionValue.length / minDescriptionLength) * 100));

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/feedback', data);
      toast.success('Feedback submitted successfully!');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-7 rounded-2xl border border-slate-200/70 bg-white/95 p-8 shadow-xl shadow-slate-200/80 backdrop-blur md:p-10">
      <div className="space-y-2">
        <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
          <MessageSquareText className="h-7 w-7 text-indigo-600" />
          Submit Your Feedback
        </h2>
        <p className="text-sm text-slate-600">
          Be specific. Clear feedback helps our team prioritize and resolve issues faster.
        </p>
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">Title</label>
        <input
          id="title"
          {...register('title')}
          placeholder="Short summary of your feedback"
          className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        {errors.title && <p className="mt-1 text-sm text-rose-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          id="description"
          {...register('description')}
          rows={5}
          placeholder="What happened? What did you expect? Include steps and context."
          className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <div className="mt-2 space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-slate-500">{descriptionValue.length}/{minDescriptionLength} characters minimum</p>
        </div>
        {errors.description && <p className="mt-1 text-sm text-rose-600">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
        <select
          id="category"
          {...register('category')}
          className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        >
          <option value="Bug">Bug</option>
          <option value="Feature Request">Feature Request</option>
          <option value="Improvement">Improvement</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && <p className="mt-1 text-sm text-rose-600">{errors.category.message}</p>}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Contact details (optional)
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
            <label htmlFor="submitterName" className="mb-1.5 block text-sm font-medium text-slate-700">Your Name</label>
            <input
              id="submitterName"
              {...register('submitterName')}
              className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Jane Doe"
            />
        </div>
        <div>
            <label htmlFor="submitterEmail" className="mb-1.5 block text-sm font-medium text-slate-700">Your Email</label>
            <input
              id="submitterEmail"
              type="email"
              {...register('submitterEmail')}
              className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="jane@example.com"
            />
            {errors.submitterEmail && <p className="mt-1 text-sm text-rose-600">{errors.submitterEmail.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <CircleHelp className="h-3.5 w-3.5" />
          We may follow up only if contact details are provided.
        </p>

        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400">
          <Send className="h-4 w-4" />
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
      </div>
    </form>
  );
}