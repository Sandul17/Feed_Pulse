'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { AuthResponse } from '@/types';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      localStorage.setItem('token', response.data.data.token);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6 rounded-2xl border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/80 backdrop-blur">
      <div className="space-y-2 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure Admin Access
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500">Sign in to review feedback and update product priorities.</p>
      </div>

      {/* <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Login Credentials</p>
        <p className="mt-1 text-sm text-amber-900"><span className="font-semibold">Username:</span> admin@feedpulse.com</p>
        <p className="text-sm text-amber-900"><span className="font-semibold">Password:</span> Admin123!</p>
      </div> */}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="admin@feedpulse.com"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password')}
            className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-11 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-indigo-600 py-2.5 px-4 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400">
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}