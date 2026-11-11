'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/supabaseClient'; // Siguraduhing tugma sa file path mo (client.ts o supabaseClient.ts)
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
            router.refresh();
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
            <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
                    <p className="text-sm text-slate-400 mt-1">Mag-log in para buksan ang iyong personal workspace.</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ako@example.com"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium rounded-lg text-white transition-colors text-sm shadow-md cursor-pointer"
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400">
                    Wala pang account?{' '}
                    <Link href="/signup" className="text-indigo-400 hover:underline font-medium">
                        Mag-sign up dito
                    </Link>
                </p>
            </div>
        </div>
    );
}