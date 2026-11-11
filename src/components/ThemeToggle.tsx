'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        setMounted(true);
        const root = document.documentElement;
        setIsDark(root.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    if (!mounted) {
        return <div className="w-9 h-9" />;
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center cursor-pointer shadow-sm"
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <Sun size={18} className="text-amber-500" />
            ) : (
                <Moon size={18} className="text-slate-700" />
            )}
        </button>
    );
}