'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
    return (
        <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 flex items-center justify-between transition-colors duration-200">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">
                    S
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">SaaS Workspace</span>
            </div>

            <nav className="flex items-center gap-4">
                <ThemeToggle />

                <Link
                    href="/login"
                    className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                    Sign In
                </Link>

                <Link
                    href="/signup"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-md shadow-indigo-950/40 cursor-pointer"
                >
                    Sign Up
                </Link>
            </nav>
        </header>
    );
}