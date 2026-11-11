'use client';

import { Suspense, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Plus, LayoutDashboard, Settings, ChevronLeft, ChevronRight, FolderKanban, Sparkles } from 'lucide-react';
import { TaskStatus, TASK_STATUS_LIST, TaskPriority, TASK_PRIORITY_LIST } from '@/types';
import { formatLabel } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';

function DashboardContent() {
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState<any>(null);
    const [workspace, setWorkspace] = useState<any>(null);
    const [role, setRole] = useState<string>('OWNER');
    const [boards, setBoards] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Sidebar Collapsible State
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('TO_DO');
    const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadData() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                router.push('/login');
                return;
            }
            setUser(user);

            let { data: memberData } = await supabase
                .from('workspace_members')
                .select(`
                    role,
                    workspaces (
                        id,
                        name,
                        slug,
                        created_at
                    )
                `)
                .eq('user_id', user.id)
                .maybeSingle();

            let ws = Array.isArray(memberData?.workspaces)
                ? memberData?.workspaces[0]
                : memberData?.workspaces;

            let userRole = memberData?.role || 'OWNER';

            if (!ws) {
                const defaultName = `${user.email?.split('@')[0]}'s Workspace`;
                const defaultSlug = `${user.email?.split('@')[0]?.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`;

                const { data: newWs, error: wsError } = await supabase
                    .from('workspaces')
                    .insert([{ name: defaultName, slug: defaultSlug }])
                    .select()
                    .single();

                if (newWs && !wsError) {
                    await supabase.from('workspace_members').insert([
                        {
                            workspace_id: newWs.id,
                            user_id: user.id,
                            role: 'OWNER',
                        },
                    ]);
                    ws = newWs;
                    userRole = 'OWNER';
                }
            }

            setWorkspace(ws);
            setRole(userRole);

            if (ws?.id) {
                const { data: boardsData } = await supabase
                    .from('boards')
                    .select('*')
                    .eq('workspace_id', ws.id)
                    .order('created_at', { ascending: false });

                setBoards(boardsData || []);
            }

            setLoadingData(false);
        }

        loadData();
    }, [router, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !workspace?.id) return;

        setLoading(true);

        const { data, error } = await supabase
            .from('boards')
            .insert([
                {
                    workspace_id: workspace.id,
                    title: title.trim(),
                },
            ])
            .select()
            .single();

        if (!error && data) {
            setBoards([data, ...boards]);
            setTitle('');
            setDescription('');
            setIsModalOpen(false);
        } else {
            alert('Failed to create board. Please try again.');
        }

        setLoading(false);
    };

    if (loadingData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-mono tracking-wider">
                LOADING WORKSPACE...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-600 dark:selection:text-emerald-300 font-sans antialiased w-full relative transition-colors duration-200">
            
            {/* Hypermodern Collapsible Sidebar */}
            <aside 
                className={`border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 flex-col justify-between hidden md:flex transition-all duration-300 relative ${
                    isSidebarCollapsed ? 'w-20' : 'w-64'
                }`}
            >
                <div className="space-y-6">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between">
                        {!isSidebarCollapsed && (
                            <div className="overflow-hidden">
                                <span className="text-[9px] font-mono tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">Workspace</span>
                                <h2 className="text-slate-900 dark:text-white font-medium truncate text-xs mt-0.5 tracking-tight">{workspace?.name || 'My Workspace'}</h2>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ml-auto"
                            aria-label="Toggle Sidebar"
                        >
                            {isSidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                        </button>
                    </div>

                    {!isSidebarCollapsed && (
                        <div className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-mono">ROLE</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">{role || 'OWNER'}</span>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                        <Link 
                            href="/dashboard" 
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                                isSidebarCollapsed ? 'justify-center' : ''
                            } bg-emerald-50 dark:bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 shadow-xs`}
                            title="Kanban Boards"
                        >
                            <LayoutDashboard size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                            {!isSidebarCollapsed && <span className="truncate tracking-tight">Kanban Boards</span>}
                        </Link>
                        
                        <a 
                            href="#settings" 
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                                isSidebarCollapsed ? 'justify-center' : ''
                            } text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white`}
                            title="Workspace Settings"
                        >
                            <Settings size={15} className="shrink-0" />
                            {!isSidebarCollapsed && <span className="truncate tracking-tight">Settings</span>}
                        </a>
                    </nav>
                </div>

                {/* Footer User Profile */}
                {!isSidebarCollapsed && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3 space-y-1 overflow-hidden">
                        <p className="text-slate-400 dark:text-slate-500 text-[9px] uppercase font-mono tracking-wider">Signed in as</p>
                        <span className="text-slate-700 dark:text-slate-300 truncate block font-mono text-[10px]">{user?.email}</span>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-w-7xl mx-auto">
                <header className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <Sparkles size={10} /> v2.0
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tracking-tight">Manage your project boards and secure workflow isolation.</p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <ThemeToggle />

                        <span className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-2 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> RLS Protected
                        </span>
                    </div>
                </header>

                {/* Hypermodern Welcome Banner */}
                <div className="bg-linear-to-br from-white dark:from-slate-900 to-slate-100 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="space-y-1 relative z-10">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white tracking-tight">Welcome back, <span className="text-emerald-600 dark:text-emerald-400">{user?.email?.split('@')[0]}</span></h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Active workspace: <strong className="text-slate-800 dark:text-slate-200 font-mono font-normal">{workspace?.name || 'Workspace'}</strong>
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="relative z-10 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition-all duration-200 shadow-lg shadow-emerald-950/20 cursor-pointer whitespace-nowrap active:scale-[0.98]"
                    >
                        <Plus size={15} /> New Board
                    </button>
                </div>

                {/* Boards Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500">Your Boards ({boards.length})</h4>
                    </div>
                    
                    {boards.length === 0 ? (
                        <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 text-xs bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm">
                            <p className="font-medium text-slate-600 dark:text-slate-300">No boards created yet.</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Click the "+ New Board" button above to spin up your first workflow.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {boards.map((board) => (
                                <Link 
                                    href={`/dashboard/boards/${board.id}`} 
                                    key={board.id} 
                                    className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-850 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                                <FolderKanban size={11} className="text-emerald-600 dark:text-emerald-400" /> KANBAN
                                            </span>
                                        </div>
                                        <h5 className="font-medium text-slate-900 dark:text-slate-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate tracking-tight">{board.title}</h5>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                                        <span className="font-mono">{new Date(board.created_at).toLocaleDateString()}</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                                            Open &rarr;
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Hypermodern Glassmorphism Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md transition-all duration-300">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative transition-all duration-200">

                        {/* Modal Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">Create New Board</h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Configure a new Kanban workspace environment.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            {/* Board Title */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Board Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Sprint 1, Personal Tasks..."
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</label>
                                <textarea
                                    rows={2}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe board objectives..."
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition resize-none shadow-inner"
                                />
                            </div>

                            {/* Grid Status & Priority */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Default Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                                    >
                                        {TASK_STATUS_LIST.map((s) => (
                                            <option value={s} key={s} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Default Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                                    >
                                        {TASK_PRIORITY_LIST.map((p) => (
                                            <option value={p} key={p} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">{formatLabel(p)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                                />
                            </div>

                            {/* Actions */}
                            <div className="pt-2 flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-1/3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-2.5 rounded-xl transition text-xs text-center cursor-pointer border border-slate-200 dark:border-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-2/3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition text-xs shadow-md shadow-emerald-950/20 cursor-pointer"
                                >
                                    {loading ? 'Creating...' : 'Create Board'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-mono">LOADING...</div>}>
            <DashboardContent />
        </Suspense>
    );
}