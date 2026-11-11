import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/50 px-3 py-1 rounded-full mb-6">
          Multi-Tenant Workspace Platform
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Manage team projects & tasks with enterprise precision.
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-8 max-w-2xl">
          Built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase. Experience real-time task sync and multi-tenant security.
        </p>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-xl transition text-sm shadow-lg shadow-emerald-950/40"
          >
            Go to Dashboard →
          </Link>
        </div>
      </section>
    </main>
  );
}