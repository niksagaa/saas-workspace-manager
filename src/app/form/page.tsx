'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { formatLabel } from '@/lib/utils';
import { TaskStatus, TASK_STATUS_LIST, TaskPriority, TASK_PRIORITY_LIST } from '@/types';

export default function TaskFormModal() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('TO_DO');
    const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log({ title, description, status, priority, dueDate });

        setTimeout(() => {
            setLoading(false);
            alert('Task created successfully (Demo)!');
            router.push('/dashboard'); // Pagka-submit, babalik sa dashboard
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-colors">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative transition-colors duration-200">

                {/* Header with Close Button */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Task</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Add a new ticket to your workspace board.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Task Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Task Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Fix authentication bug"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the task requirements..."
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                        />
                    </div>

                    {/* Grid for Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                            >
                                {TASK_STATUS_LIST.map((s) => (
                                    <option value={s} key={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                            >
                                {TASK_PRIORITY_LIST.map((p) => (
                                    <option value={p} key={p}>{formatLabel(p)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="w-1/3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-2.5 rounded-xl transition text-sm text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-2/3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition text-sm shadow-lg shadow-emerald-950/40 cursor-pointer"
                        >
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}